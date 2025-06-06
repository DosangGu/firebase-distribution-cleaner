#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const cleaner_1 = require("./cleaner");
async function main() {
    const program = new commander_1.Command();
    program
        .requiredOption("-p, --projectId <projectId>", "Firebase Project ID")
        .option("-k, --serviceAccountKey <path>", "Path to Firebase service account key JSON file. Used if --serviceAccountKeyJson is not provided.")
        .option("--serviceAccountKeyJson <jsonString>", "Firebase service account key as a JSON string. Takes precedence over --serviceAccountKey.")
        .option("-a, --appId <appId>", "Specific Firebase App ID to process")
        .option("-c, --minCount <number>", "Minimum number of artifacts to keep (optional)")
        .option("-d, --maxDays <number>", "Maximum age in days for artifacts to keep (optional)")
        .option("-b, --minBuildVersion <version>", "Minimum build version threshold. Only delete releases with build version less than this value (optional)")
        .parse(process.argv);
    const options = program.opts();
    const cleanerOptions = {
        projectId: options.projectId,
        serviceAccountKeyPath: options.serviceAccountKey,
        serviceAccountKeyJson: options.serviceAccountKeyJson,
        appId: options.appId,
        minCount: options.minCount ? parseInt(options.minCount, 10) : undefined,
        maxDays: options.maxDays ? parseInt(options.maxDays, 10) : undefined,
        minBuildVersion: options.minBuildVersion,
    };
    try {
        await (0, cleaner_1.runCleaner)(cleanerOptions);
    }
    catch (error) {
        process.exit(1);
    }
}
main();
