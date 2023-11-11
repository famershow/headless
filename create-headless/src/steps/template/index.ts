import { confirm, log, select, spinner } from "@clack/prompts";
import { copyTemplate } from "./copy-template";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import recursiveReaddir from "recursive-readdir";
import fse from "fs-extra";
import { template_options } from "~/consts";
import { cancel } from "~/utils";

export const IGNORED_TEMPLATE_DIRECTORIES = [".git", "node_modules"];

export function stripDirectoryFromPath(dir: string, filePath: string) {
  // Can't just do a regexp replace here since the windows paths mess it up :/
  let stripped = filePath;
  if (
    (dir.endsWith(path.sep) && filePath.startsWith(dir)) ||
    (!dir.endsWith(path.sep) && filePath.startsWith(dir + path.sep))
  ) {
    stripped = filePath.slice(dir.length);
    if (stripped.startsWith(path.sep)) {
      stripped = stripped.slice(1);
    }
  }
  return stripped;
}

async function getDirectoryFilesRecursive(dir: string) {
  let files = await recursiveReaddir(dir, [
    (file) => {
      let strippedFile = stripDirectoryFromPath(dir, file);
      let parts = strippedFile.split(path.sep);
      return (
        parts.length > 1 && IGNORED_TEMPLATE_DIRECTORIES.includes(parts[0])
      );
    },
  ]);
  return files.map((f) => stripDirectoryFromPath(dir, f));
}

export default async function template(dir: string) {
  const template =
    template_options.length === 1
      ? template_options[0].value
      : await select({
          message: "Choose a template",
          options: template_options,
        });

  cancel(template);

  const tSpinner = spinner();

  tSpinner.start();
  tSpinner.message("Creating your project");

  let tempDir = path.join(
    await fs.promises.realpath(os.tmpdir()),
    `create-headless--${Math.random().toString(36).substr(2, 8)}`
  );

  await ensureDirectory(tempDir);

  const result = await copyTemplate(String(template), tempDir, {
    debug: true,
    onError: (error: Error) => {
      log.error(error.message);
    },
  });

  if (result?.localTemplateDirectory) {
    tempDir = path.resolve(result.localTemplateDirectory);
  }

  await ensureDirectory(dir);

  let files1 = await getDirectoryFilesRecursive(tempDir);
  let files2 = await getDirectoryFilesRecursive(dir);
  let collisions = files1
    .filter((f) => files2.includes(f))
    .sort((a, b) => a.localeCompare(b));

  if (collisions.length > 0) {
    let getFileList = (prefix: string) => {
      let moreFiles = collisions.length - 5;
      let lines = ["", ...collisions.slice(0, 5)];
      if (moreFiles > 0) {
        lines.push(`and ${moreFiles} more...`);
      }
      return lines.join(`\n${prefix}`);
    };

    let overwrite = await confirm({
      message:
        `Your project directory contains files that will be overwritten by\n` +
        `             this template (you can force with \`--overwrite\`)\n\n` +
        `             Files that would be overwritten:` +
        `${getFileList("               ")}\n\n` +
        `             Do you wish to continue?\n` +
        `             `,
      initialValue: false,
    });
    if (!overwrite) {
      throw new Error("Exiting to avoid overwriting files");
    }
  }

  await fse.copy(tempDir, dir, {
    filter(src, dest) {
      // We never copy .git/ or node_modules/ directories since it's highly
      // unlikely we want them copied
      let file = stripDirectoryFromPath(tempDir, src);
      let isIgnored = IGNORED_TEMPLATE_DIRECTORIES.includes(file);
      if (isIgnored) {
        return false;
      }
      return true;
    },
  });

  tSpinner.stop("Project created!");
}

export function directoryExists(p: string) {
  try {
    let stat = fs.statSync(p);
    return stat.isFile() || stat.isDirectory();
  } catch {
    return false;
  }
}

export async function ensureDirectory(dir: string) {
  if (!directoryExists(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
}
