import { Release } from "./types";
import { VersionUtils } from "./version-utils";

export class ReleaseFilterService {
  static filterReleasesToDelete(
    releases: Release[],
    minCount?: number,
    maxDays?: number,
    minBuildVersion?: string,
    keepLatestOfEachVersion?: boolean
  ): Release[] {
    if (!releases || releases.length === 0) {
      return [];
    }

    // Sort releases by creation time (newest first)
    const sortedReleases = [...releases].sort(
      (a, b) =>
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );

    // If keepLatestOfEachVersion is enabled, identify the latest release for each version combination
    const latestOfEachVersion = new Set<string>();
    if (keepLatestOfEachVersion) {
      const versionMap = new Map<string, Release>();
      for (const release of sortedReleases) {
        const versionKey = `${release.displayVersion}+${release.buildVersion}`;
        if (!versionMap.has(versionKey)) {
          versionMap.set(versionKey, release);
          latestOfEachVersion.add(release.name);
        }
      }
    }

    const releasesToDelete: Release[] = [];
    const cutoffDate = maxDays ? new Date() : null;
    if (cutoffDate && maxDays) {
      cutoffDate.setDate(cutoffDate.getDate() - maxDays);
    }

    for (let i = 0; i < sortedReleases.length; i++) {
      const release = sortedReleases[i];
      const releaseDate = new Date(release.createTime);

      // Apply filters only if they are provided
      let shouldDelete = true;

      // Check minCount threshold (keep the newest minCount releases)
      if (minCount !== undefined && i < minCount) {
        shouldDelete = false;
      }

      // Check maxDays threshold (only delete if older than maxDays)
      if (maxDays !== undefined && cutoffDate && releaseDate >= cutoffDate) {
        shouldDelete = false;
      }

      // Check minBuildVersion threshold (only delete if build version is less than threshold)
      if (minBuildVersion !== undefined) {
        if (!VersionUtils.isVersionLessThan(release.buildVersion, minBuildVersion)) {
          shouldDelete = false;
        }
      }

      // Check if this release should be kept as the latest of its version
      if (keepLatestOfEachVersion && latestOfEachVersion.has(release.name)) {
        shouldDelete = false;
      }

      // If no thresholds are provided, don't delete anything
      if (minCount === undefined && maxDays === undefined && minBuildVersion === undefined) {
        shouldDelete = false;
      }

      if (shouldDelete) {
        releasesToDelete.push(release);
      }
    }

    return releasesToDelete;
  }

  static logReleasesToDelete(releases: Release[]): void {
    if (releases.length === 0) {
      console.log("No releases to delete based on current criteria.");
      return;
    }

    console.log(`Found ${releases.length} release(s) to delete:`);
    for (const release of releases) {
      console.log(
        `- ${release.displayVersion} (${release.buildVersion}), Created: ${release.createTime}`
      );
    }
  }
}
