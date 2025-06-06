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
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - maxDays);
        for (let i = 0; i < sortedReleases.length; i++) {
            const release = sortedReleases[i];
            const releaseDate = new Date(release.createTime);
            // Only delete if:
            // 1. We have more than minCount releases (keep the newest minCount releases)
            // 2. The release is older than maxDays
            if (i >= minCount && releaseDate < cutoffDate) {
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
