"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppProcessorService = void 0;
const release_filter_service_1 = require("./release-filter-service");
class AppProcessorService {
    constructor(firebaseApiService) {
        this.firebaseApiService = firebaseApiService;
    }
    async processApp(projectId, appId, minCount, maxDays, minBuildVersion, keepLatestOfEachVersion, appName) {
        const displayName = appName ? `${appName} (${appId})` : appId;
        console.log(`Processing app: ${displayName}`);
        const releases = await this.firebaseApiService.listReleases(projectId, appId);
        if (!releases || releases.length === 0) {
            console.log("No releases found for this app.");
            return;
        }
        console.log(`Found ${releases.length} release(s).`);
        // Check if any filters are applied
        if (minCount === undefined && maxDays === undefined && minBuildVersion === undefined) {
            console.log("No filtering criteria provided (minCount, maxDays, or minBuildVersion). No releases will be deleted.");
            return;
        }
        const filtersApplied = [];
        if (minCount !== undefined) {
            filtersApplied.push(`keeping newest ${minCount} releases`);
        }
        if (maxDays !== undefined) {
            filtersApplied.push(`deleting releases older than ${maxDays} days`);
        }
        if (minBuildVersion !== undefined) {
            filtersApplied.push(`deleting releases with build version < ${minBuildVersion}`);
        }
        if (keepLatestOfEachVersion) {
            filtersApplied.push(`keeping latest release of each version`);
        }
        console.log(`Applying filters: ${filtersApplied.join(", ")}`);
        const releasesToDelete = release_filter_service_1.ReleaseFilterService.filterReleasesToDelete(releases, minCount, maxDays, minBuildVersion, keepLatestOfEachVersion);
        release_filter_service_1.ReleaseFilterService.logReleasesToDelete(releasesToDelete);
        if (releasesToDelete.length > 0) {
            const releaseNamesToDelete = releasesToDelete.map((release) => release.name);
            try {
                await this.firebaseApiService.deleteReleases(projectId, appId, releaseNamesToDelete);
            }
            catch (error) {
                console.error(`Error batch deleting releases for app ${appId}:`, error);
            }
        }
    }
    async processAllApps(projectId, minCount, maxDays, minBuildVersion, keepLatestOfEachVersion) {
        console.log(`Fetching apps for project: ${projectId}`);
        const apps = await this.firebaseApiService.listApps(projectId);
        if (!apps || apps.length === 0) {
            console.log("No apps found in this project.");
            return;
        }
        console.log(`Found ${apps.length} app(s):`);
        apps.forEach((app) => console.log(`- ${app.name} (ID: ${app.appId}, Platform: ${app.platform})`));
        for (const app of apps) {
            await this.processApp(projectId, app.appId, minCount, maxDays, minBuildVersion, keepLatestOfEachVersion, app.name);
        }
    }
}
exports.AppProcessorService = AppProcessorService;
