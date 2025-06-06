"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCleaner = runCleaner;
const auth_service_1 = require("./auth-service");
const firebase_api_service_1 = require("./firebase-api-service");
const app_processor_service_1 = require("./app-processor-service");
async function runCleaner(options) {
    const { projectId, serviceAccountKeyPath, serviceAccountKeyJson, appId: appIdOption, minCount, maxDays, minBuildVersion, keepLatestOfEachVersion, } = options;
    try {
        // Initialize Firebase Admin SDK
        auth_service_1.AuthService.initializeFirebaseAdmin(serviceAccountKeyPath, serviceAccountKeyJson);
        // Create Google Auth instance
        const googleAuth = auth_service_1.AuthService.createGoogleAuth(serviceAccountKeyPath, serviceAccountKeyJson);
        // Create service instances
        const firebaseApiService = new firebase_api_service_1.FirebaseApiService(googleAuth);
        const appProcessorService = new app_processor_service_1.AppProcessorService(firebaseApiService);
        // Process specific app or all apps
        if (appIdOption) {
            console.log(`Processing specified app: ${appIdOption} for project: ${projectId}`);
            await appProcessorService.processApp(projectId, appIdOption, minCount, maxDays, minBuildVersion, keepLatestOfEachVersion);
        }
        else {
            await appProcessorService.processAllApps(projectId, minCount, maxDays, minBuildVersion, keepLatestOfEachVersion);
        }
        console.log("Cleaning complete.");
    }
    catch (error) {
        console.error("Error during cleaner execution:", error);
        throw error;
    }
}
