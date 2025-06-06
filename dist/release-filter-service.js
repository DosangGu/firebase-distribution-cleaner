"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseFilterService = void 0;
class ReleaseFilterService {
    static filterReleasesToDelete(releases, minCount, maxDays) {
        if (!releases || releases.length === 0) {
            return [];
        }
        // Sort releases by creation time (newest first)
        const sortedReleases = [...releases].sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
        const releasesToDelete = [];
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
            // If no thresholds are provided, don't delete anything
            if (minCount === undefined && maxDays === undefined) {
                shouldDelete = false;
            }
            if (shouldDelete) {
                releasesToDelete.push(release);
            }
        }
        return releasesToDelete;
    }
    static logReleasesToDelete(releases) {
        if (releases.length === 0) {
            console.log("No releases to delete based on current criteria.");
            return;
        }
        console.log(`Found ${releases.length} release(s) to delete:`);
        for (const release of releases) {
            console.log(`- ${release.displayVersion} (${release.buildVersion}), Created: ${release.createTime}`);
        }
    }
}
exports.ReleaseFilterService = ReleaseFilterService;
