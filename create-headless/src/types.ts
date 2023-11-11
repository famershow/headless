export interface Context {
  name: string;
}

export interface CopyTemplateOptions {
  debug?: boolean;
  token?: string;
  onError(error: unknown): any;
  log?(message: string): any;
}

export interface RepoInfo {
  owner: string;
  name: string;
  branch?: string | null;
  filePath?: string | null;
}

export interface TarballDownloadOptions {
  debug?: boolean;
  filePath?: string | null;
  token?: string;
}

export interface DownloadAndExtractTarballOptions {
  token?: string;
  filePath?: string | null;
}

export interface ReleaseAssetInfo {
  browserUrl: string;
  owner: string;
  name: string;
  asset: string;
  tag: string;
}

export interface GitHubApiUploader {
  name: string | null;
  email: string | null;
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  starred_at: string;
}

// https://docs.github.com/en/rest/releases/assets?apiVersion=2022-11-28#get-a-release-asset
export interface GitHubApiReleaseAsset {
  url: string;
  browser_download_url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  state: "uploaded" | "open";
  content_type: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  uploader: null | GitHubApiUploader;
}

export type GithubUrlString =
  | `https://github.com/${string}/${string}`
  | `https://www.github.com/${string}/${string}`;
