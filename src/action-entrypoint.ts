import * as core from "@actions/core";
import { runCleaner } from "./cleaner";
import { CleanerOptions } from "./types";

async function run(): Promise<void> {
  try {
    const projectId = core.getInput("project-id", { required: true });
    const serviceAccountKeyJson = core.getInput("service-account-key-json");
    const serviceAccountKeyPath = core.getInput("service-account-key-path");
    const appId = core.getInput("app-id");
    const minCount = core.getInput("min-count") ? parseInt(core.getInput("min-count"), 10) : undefined;
    const maxDays = core.getInput("max-days") ? parseInt(core.getInput("max-days"), 10) : undefined;
    const minBuildVersion = core.getInput("min-build-version") || undefined;
    const keepLatestOfEachVersion = core.getBooleanInput("keep-latest-of-each-version") || false;

    if (
      !serviceAccountKeyJson &&
      !serviceAccountKeyPath &&
      !process.env.GOOGLE_APPLICATION_CREDENTIALS
    ) {
      core.setFailed(
        'Either "service-account-key-json", "service-account-key-path", or GOOGLE_APPLICATION_CREDENTIALS env must be provided.'
      );
      return;
    }

    const cleanerOptions: CleanerOptions = {
      projectId,
      serviceAccountKeyJson: serviceAccountKeyJson || undefined,
      serviceAccountKeyPath: serviceAccountKeyPath || undefined,
      appId: appId || undefined,
      minCount,
      maxDays,
      minBuildVersion,
      keepLatestOfEachVersion,
    };

    await runCleaner(cleanerOptions);
    core.info("Firebase Distribution Cleaner action completed successfully.");
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("An unknown error occurred");
    }
  }
}

run();
