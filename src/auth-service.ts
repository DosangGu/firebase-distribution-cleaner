import * as admin from "firebase-admin";
import { GoogleAuth } from "google-auth-library";

export class AuthService {
  static initializeFirebaseAdmin(
    serviceAccountKeyPath?: string,
    serviceAccountKeyJson?: string
  ): void {
    // Initialize Firebase Admin SDK only if not already initialized
    if (!admin.apps.length) {
      if (serviceAccountKeyJson) {
        try {
          const serviceAccount = JSON.parse(serviceAccountKeyJson);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        } catch (e) {
          console.error(
            "Failed to parse serviceAccountKeyJson for Firebase Admin SDK:",
            (e as Error).message
          );
          throw new Error(
            "Failed to initialize Firebase Admin SDK with JSON key."
          );
        }
      } else if (serviceAccountKeyPath) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const serviceAccount = require(serviceAccountKeyPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else {
        try {
          admin.initializeApp();
          console.log(
            "Initialized Firebase Admin SDK using Application Default Credentials."
          );
        } catch (e) {
          console.error(
            "Failed to initialize Firebase Admin SDK with Application Default Credentials. " +
              "Ensure credentials are set up correctly (e.g., GOOGLE_APPLICATION_CREDENTIALS environment variable) " +
              "or provide a service account key.",
            e
          );
          throw new Error("Failed to initialize Firebase Admin SDK with ADC.");
        }
      }
    }
  }

  static createGoogleAuth(
    serviceAccountKeyPath?: string,
    serviceAccountKeyJson?: string
  ): GoogleAuth {
    if (serviceAccountKeyJson) {
      try {
        const credentials = JSON.parse(serviceAccountKeyJson);
        return new GoogleAuth({
          credentials,
          scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        });
      } catch (e) {
        throw new Error(
          "Failed to parse serviceAccountKeyJson: " + (e as Error).message
        );
      }
    } else if (serviceAccountKeyPath) {
      return new GoogleAuth({
        keyFile: serviceAccountKeyPath,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      });
    } else {
      return new GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      });
    }
  }
}
