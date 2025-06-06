"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const admin = __importStar(require("firebase-admin"));
const google_auth_library_1 = require("google-auth-library");
class AuthService {
    static initializeFirebaseAdmin(serviceAccountKeyPath, serviceAccountKeyJson) {
        // Initialize Firebase Admin SDK only if not already initialized
        if (!admin.apps.length) {
            if (serviceAccountKeyJson) {
                try {
                    const serviceAccount = JSON.parse(serviceAccountKeyJson);
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                    });
                }
                catch (e) {
                    console.error("Failed to parse serviceAccountKeyJson for Firebase Admin SDK:", e.message);
                    throw new Error("Failed to initialize Firebase Admin SDK with JSON key.");
                }
            }
            else if (serviceAccountKeyPath) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const serviceAccount = require(serviceAccountKeyPath);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
            }
            else {
                try {
                    admin.initializeApp();
                    console.log("Initialized Firebase Admin SDK using Application Default Credentials.");
                }
                catch (e) {
                    console.error("Failed to initialize Firebase Admin SDK with Application Default Credentials. " +
                        "Ensure credentials are set up correctly (e.g., GOOGLE_APPLICATION_CREDENTIALS environment variable) " +
                        "or provide a service account key.", e);
                    throw new Error("Failed to initialize Firebase Admin SDK with ADC.");
                }
            }
        }
    }
    static createGoogleAuth(serviceAccountKeyPath, serviceAccountKeyJson) {
        if (serviceAccountKeyJson) {
            try {
                const credentials = JSON.parse(serviceAccountKeyJson);
                return new google_auth_library_1.GoogleAuth({
                    credentials,
                    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
                });
            }
            catch (e) {
                throw new Error("Failed to parse serviceAccountKeyJson: " + e.message);
            }
        }
        else if (serviceAccountKeyPath) {
            return new google_auth_library_1.GoogleAuth({
                keyFile: serviceAccountKeyPath,
                scopes: ["https://www.googleapis.com/auth/cloud-platform"],
            });
        }
        else {
            return new google_auth_library_1.GoogleAuth({
                scopes: ["https://www.googleapis.com/auth/cloud-platform"],
            });
        }
    }
}
exports.AuthService = AuthService;
