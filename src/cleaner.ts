import { CleanerOptions } from "./types";
import { AuthService } from "./auth-service";
import { FirebaseApiService } from "./firebase-api-service";
import { AppProcessorService } from "./app-processor-service";

// Re-export types for backward compatibility
export { CleanerOptions, App, Release } from "./types";

export async function runCleaner(options: CleanerOptions): Promise<void> {
  const {
    projectId,
    serviceAccountKeyPath,
    serviceAccountKeyJson,
    appId: appIdOption,
    minCount,
    maxDays,
    minBuildVersion,
  } = options;

  try {
    // Initialize Firebase Admin SDK
    AuthService.initializeFirebaseAdmin(
      serviceAccountKeyPath,
      serviceAccountKeyJson
    );

    // Create Google Auth instance
    const googleAuth = AuthService.createGoogleAuth(
      serviceAccountKeyPath,
      serviceAccountKeyJson
    );

    // Create service instances
    const firebaseApiService = new FirebaseApiService(googleAuth);
    const appProcessorService = new AppProcessorService(firebaseApiService);

    // Process specific app or all apps
    if (appIdOption) {
      console.log(
        `Processing specified app: ${appIdOption} for project: ${projectId}`
      );
      await appProcessorService.processApp(
        projectId,
        appIdOption,
        minCount,
        maxDays,
        minBuildVersion
      );
    } else {
      await appProcessorService.processAllApps(projectId, minCount, maxDays, minBuildVersion);
    }

    console.log("Cleaning complete.");
  } catch (error) {
    console.error("Error during cleaner execution:", error);
    throw error;
  }
}
