import fetch, { HeadersInit } from "node-fetch";
import { ProxyAgent } from "proxy-agent";
import path from "node:path";
import stream from "node:stream";
import { promisify } from "node:util";
import gunzip from "gunzip-maybe";
import tar from "tar-fs";
import {
  GithubUrlString,
  RepoInfo,
  CopyTemplateOptions,
  ReleaseAssetInfo,
  DownloadAndExtractTarballOptions,
  GitHubApiReleaseAsset,
  TarballDownloadOptions,
} from "../../types";

export function isUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch (_) {
    return false;
  }
}

function isValidGithubRepoUrl(input: string) {
  if (!isUrl(input)) {
    return false;
  }
  try {
    let url = new URL(input);
    let pathSegments = url.pathname.slice(1).split("/");

    return (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      // The pathname must have at least 2 segments. If it has more than 2, the
      // third must be "tree" and it must have at least 4 segments.
      // https://github.com/:owner/:repo
      // https://github.com/:owner/:repo/tree/:ref
      pathSegments.length >= 2 &&
      (pathSegments.length > 2
        ? pathSegments[2] === "tree" && pathSegments.length >= 4
        : true)
    );
  } catch (_) {
    return false;
  }
}

function getRepoInfo(validatedGithubUrl: string): RepoInfo {
  let url = new URL(validatedGithubUrl);
  let [, owner, name, tree, branch, ...file] = url.pathname.split("/") as [
    _: string,
    Owner: string,
    Name: string,
    Tree: string | undefined,
    Branch: string | undefined,
    FileInfo: string | undefined
  ];
  let filePath = file.join("/");

  if (tree === undefined) {
    return {
      owner,
      name,
      branch: null,
      filePath: null,
    };
  }

  return {
    owner,
    name,
    // If we've validated the GitHub URL and there is a tree, there will also be
    // a branch
    branch: branch!,
    filePath: filePath === "" || filePath === "/" ? null : filePath,
  };
}

async function copyTemplateFromGithubRepoUrl(
  repoUrl: string,
  destPath: string,
  options: CopyTemplateOptions
) {
  await downloadAndExtractRepoTarball(getRepoInfo(repoUrl), destPath, options);
}

function isGithubReleaseAssetUrl(url: string) {
  /**
   * Accounts for the following formats:
   * https://github.com/owner/repository/releases/download/v0.0.1/stack.tar.gz
   * ~or~
   * https://github.com/owner/repository/releases/latest/download/stack.tar.gz
   */
  return (
    url.startsWith("https://github.com") &&
    (url.includes("/releases/download/") ||
      url.includes("/releases/latest/download/"))
  );
}

function getGithubReleaseAssetInfo(browserUrl: string): ReleaseAssetInfo {
  /**
   * https://github.com/owner/repository/releases/download/v0.0.1/stack.tar.gz
   * ~or~
   * https://github.com/owner/repository/releases/latest/download/stack.tar.gz
   */

  let url = new URL(browserUrl);
  let [, owner, name, , downloadOrLatest, tag, asset] = url.pathname.split("/");

  if (downloadOrLatest === "latest" && tag === "download") {
    // handle the Github URL quirk for latest releases
    tag = "latest";
  }

  return {
    browserUrl,
    owner,
    name,
    asset,
    tag,
  };
}

export class CopyTemplateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CopyTemplateError";
  }
}

const defaultAgent = new ProxyAgent();
const httpsAgent = new ProxyAgent();
httpsAgent.protocol = "https:";

function agent(url: string) {
  return new URL(url).protocol === "https:" ? httpsAgent : defaultAgent;
}

const pipeline = promisify(stream.pipeline);

async function downloadAndExtractTarball(
  downloadPath: string,
  tarballUrl: string,
  { token, filePath }: DownloadAndExtractTarballOptions
): Promise<void> {
  let resourceUrl = tarballUrl;
  let headers: HeadersInit = {};
  let isGithubUrl = new URL(tarballUrl).host.endsWith("github.com");
  if (token && isGithubUrl) {
    headers.Authorization = `token ${token}`;
  }
  if (isGithubReleaseAssetUrl(tarballUrl)) {
    // We can download the asset via the github api, but first we need to look
    // up the asset id
    let info = getGithubReleaseAssetInfo(tarballUrl);
    headers.Accept = "application/vnd.github.v3+json";

    let releaseUrl =
      info.tag === "latest"
        ? `https://api.github.com/repos/${info.owner}/${info.name}/releases/latest`
        : `https://api.github.com/repos/${info.owner}/${info.name}/releases/tags/${info.tag}`;

    let response = await fetch(releaseUrl, {
      agent: agent("https://api.github.com"),
      headers,
    });

    if (response.status !== 200) {
      throw new CopyTemplateError(
        "There was a problem fetching the file from GitHub. The request " +
          `responded with a ${response.status} status. Please try again later.`
      );
    }

    let body = (await response.json()) as { assets: GitHubApiReleaseAsset[] };
    if (
      !body ||
      typeof body !== "object" ||
      !body.assets ||
      !Array.isArray(body.assets)
    ) {
      throw new CopyTemplateError(
        "There was a problem fetching the file from GitHub. No asset was " +
          "found at that url. Please try again later."
      );
    }

    let assetId = body.assets.find((asset) => {
      // If the release is "latest", the url won't match the download url
      return info.tag === "latest"
        ? asset?.browser_download_url?.includes(info.asset)
        : asset?.browser_download_url === tarballUrl;
    })?.id;
    if (assetId == null) {
      throw new CopyTemplateError(
        "There was a problem fetching the file from GitHub. No asset was " +
          "found at that url. Please try again later."
      );
    }
    resourceUrl = `https://api.github.com/repos/${info.owner}/${info.name}/releases/assets/${assetId}`;
    headers.Accept = "application/octet-stream";
  }
  let response = await fetch(resourceUrl, {
    agent: agent(resourceUrl),
    headers,
  });

  if (!response.body || response.status !== 200) {
    if (token) {
      throw new CopyTemplateError(
        `There was a problem fetching the file${
          isGithubUrl ? " from GitHub" : ""
        }. The request ` +
          `responded with a ${response.status} status. Perhaps your \`--token\`` +
          "is expired or invalid."
      );
    }
    throw new CopyTemplateError(
      `There was a problem fetching the file${
        isGithubUrl ? " from GitHub" : ""
      }. The request ` +
        `responded with a ${response.status} status. Please try again later.`
    );
  }

  // file paths returned from github are always unix style
  if (filePath) {
    filePath = filePath.split(path.sep).join(path.posix.sep);
  }

  let filePathHasFiles = false;

  try {
    await pipeline(
      response.body.pipe(gunzip()),
      tar.extract(downloadPath, {
        map(header) {
          let originalDirName = header.name.split("/")[0];
          header.name = header.name.replace(`${originalDirName}/`, "");

          if (filePath) {
            // Include trailing slash on startsWith when filePath doesn't include
            // it so something like `templates/remix` doesn't inadvertently
            // include `templates/remix-javascript/*` files
            if (
              (filePath.endsWith(path.posix.sep) &&
                header.name.startsWith(filePath)) ||
              (!filePath.endsWith(path.posix.sep) &&
                header.name.startsWith(filePath + path.posix.sep))
            ) {
              filePathHasFiles = true;
              header.name = header.name.replace(filePath, "");
            } else {
              header.name = "__IGNORE__";
            }
          }

          return header;
        },
        ignore(_filename, header) {
          if (!header) {
            throw Error("Header is undefined");
          }
          return header.name === "__IGNORE__";
        },
      })
    );
  } catch (_) {
    throw new CopyTemplateError(
      "There was a problem extracting the file from the provided template." +
        `  Template URL: \`${tarballUrl}\`` +
        `  Destination directory: \`${downloadPath}\``
    );
  }

  if (filePath && !filePathHasFiles) {
    throw new CopyTemplateError(
      `The path "${filePath}" was not found in this ${
        isGithubUrl ? "GitHub repo." : "tarball."
      }`
    );
  }
}

async function downloadAndExtractRepoTarball(
  repo: RepoInfo,
  destPath: string,
  options: TarballDownloadOptions
) {
  // If we have a direct file path we will also have the branch. We can skip the
  // redirect and get the tarball URL directly.
  if (repo.branch && repo.filePath) {
    let tarballURL = `https://codeload.github.com/${repo.owner}/${repo.name}/tar.gz/${repo.branch}`;
    return await downloadAndExtractTarball(destPath, tarballURL, {
      ...options,
      filePath: repo.filePath,
    });
  }

  // If we don't know the branch, the GitHub API will figure out the default and
  // redirect the request to the tarball.
  // https://docs.github.com/en/rest/reference/repos#download-a-repository-archive-tar
  let url = `https://api.github.com/repos/${repo.owner}/${repo.name}/tarball`;
  if (repo.branch) {
    url += `/${repo.branch}`;
  }

  return await downloadAndExtractTarball(destPath, url, {
    ...options,
    filePath: repo.filePath ?? null,
  });
}

async function copyTemplateFromGithubRepoShorthand(
  repoShorthand: string,
  destPath: string,
  options: CopyTemplateOptions
) {
  let [owner, name, ...path] = repoShorthand.split("/");
  let filePath = path.length ? path.join("/") : null;

  await downloadAndExtractRepoTarball(
    { owner, name, filePath },
    destPath,
    options
  );
}

function isGithubRepoShorthand(value: string) {
  if (isUrl(value)) {
    return false;
  }
  // This supports :owner/:repo and :owner/:repo/nested/path, e.g.
  // remix-run/remix
  // remix-run/remix/templates/express
  // remix-run/examples/socket.io
  return /^[\w-]+\/[\w-]+(\/[\w-.]+)*$/.test(value);
}

export async function copyTemplate(
  template: string,
  destPath: string,
  options: CopyTemplateOptions
): Promise<{ localTemplateDirectory: string } | undefined> {
  let { log = () => {} } = options;

  /**
   * Valid templates are:
   * - github owner/repo shorthand
   * - github owner/repo/directory shorthand
   * - full github repo URL
   */

  try {
    if (isGithubRepoShorthand(template)) {
      log(`Using the template from the "${template}" repo`);
      await copyTemplateFromGithubRepoShorthand(template, destPath, options);
      return;
    }

    if (isValidGithubRepoUrl(template)) {
      log(`Using the template from "${template}"`);
      await copyTemplateFromGithubRepoUrl(template, destPath, options);
      return;
    }

    throw new CopyTemplateError(`"${template}" is an invalid template. :()`);
  } catch (error) {
    await options.onError(error);
  }
}
