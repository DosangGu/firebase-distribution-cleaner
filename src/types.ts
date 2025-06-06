export interface App {
  name: string;
  appId: string;
  platform: string;
}

export interface Release {
  name: string;
  releaseNotes: {
    text: string;
  };
  displayVersion: string;
  buildVersion: string;
  createTime: string; // ISO 8601 format
}

export interface CleanerOptions {
  projectId: string;
  serviceAccountKeyPath?: string;
  serviceAccountKeyJson?: string;
  appId?: string;
  minCount?: number;
  maxDays?: number;
  minBuildVersion?: string;
}
