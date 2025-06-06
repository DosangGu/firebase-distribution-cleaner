# Firebase Distribution Cleaner

`firebase-distribution-cleaner` is a CLI tool to help you manage and clean artifacts in Firebase App Distribution. It allows you to list apps, list releases for an app, and delete releases based on criteria such as the number of releases to keep and the maximum age of releases.

## Features

- Delete releases for an app based on:
  - Minimum number of releases to keep.
  - Maximum age (in days) of releases to keep.
  - Minimum build version threshold (semantic or numeric versioning).
  - Keep latest release of each unique version combination.
- Process a specific app or all apps in a project.
- Authenticate using a Firebase service account key JSON file or Application Default Credentials.

## Installation

```bash
npm install -g firebase-distribution-cleaner
```

Or use it with `npx`:

```bash
npx firebase-distribution-cleaner --projectId <your-project-id> [options]
```

## Usage

```bash
firebase-distribution-cleaner [options]
```

### Options

- `-p, --projectId <projectId>`: (Required) Firebase Project ID.
- `-k, --serviceAccountKey <path>`: (Optional) Path to Firebase service account key JSON file. Used if --serviceAccountKeyJson is not provided.
- `--serviceAccountKeyJson <jsonString>`: (Optional) Firebase service account key as a JSON string. Takes precedence over --serviceAccountKey.
- `-a, --appId <appId>`: (Optional) Specific Firebase App ID to process. If not provided, all apps in the project will be processed.
- `-c, --minCount <number>`: (Optional) Minimum number of artifacts to keep.
- `-d, --maxDays <number>`: (Optional) Maximum age in days for artifacts to keep.
- `-b, --minBuildVersion <version>`: (Optional) Minimum build version threshold. Only delete releases with build version less than this value.
- `-l, --keepLatestOfEachVersion`: (Optional) Keep the latest release for each unique display+build version combination, even if it would be deleted by other filters.
- `-h, --help`: Display help for command.

### Examples

1. **Delete artifacts for all apps in a project, keeping the latest 10 releases and releases newer than 60 days (using service account key):**

   ```bash
   firebase-distribution-cleaner -p YOUR_PROJECT_ID -k /path/to/your/serviceAccountKey.json -c 10 -d 60
   ```

2. **Delete artifacts for a specific app, keeping the latest 3 releases and releases newer than 15 days (using Application Default Credentials):**

   ```bash
   firebase-distribution-cleaner -p YOUR_PROJECT_ID -a YOUR_APP_ID -c 3 -d 15
   ```

3. **Delete releases below build version 2.0.0, but keep the latest release of each version:**

   ```bash
   firebase-distribution-cleaner -p YOUR_PROJECT_ID -b "2.0.0" -l
   ```

4. **Complex filtering - keep minimum 5 releases, delete anything older than 30 days, but preserve latest of each version:**

   ```bash
   firebase-distribution-cleaner -p YOUR_PROJECT_ID -c 5 -d 30 -l
   ```

## How it Works

The tool interacts with the Firebase App Distribution API to:

1. Fetch a list of apps in your Firebase project (if no specific `appId` is provided).
2. For each app (or the specified app):
   a. Fetch all its releases.
   b. Sort the releases by creation time (newest first).
   c. Determine which releases to delete based on the `minCount` (number of releases to keep) and `maxDays` (age of releases to keep) criteria.
   d. Batch delete the identified releases.

## Authentication

The tool uses the `google-auth-library` for authentication.

- **Service Account Key**: You can provide the path to a service account key JSON file using the `-k` or `--serviceAccountKey` option. This key must have the necessary permissions to access Firebase App Distribution data (e.g., "Firebase App Distribution Admin" role or equivalent custom role).
- **Application Default Credentials (ADC)**: If no service account key path is provided, the tool will attempt to use ADC. Ensure that the environment where you run the tool is configured for ADC (e.g., running on Google Cloud infrastructure like Cloud Functions, Cloud Run, GCE, or by having run `gcloud auth application-default login`).

## Building from Source

If you want to build the tool from source:

1. Clone the repository:

   ```bash
   git clone https://github.com/DosangGu/firebase-distribution-cleaner.git
   cd firebase-distribution-cleaner
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the TypeScript code:

   ```bash
   npm run build
   ```

4. You can then run the tool locally:

   ```bash
   node dist/index.js -p YOUR_PROJECT_ID [options]
   ```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
