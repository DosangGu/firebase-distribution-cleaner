"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionUtils = void 0;
/**
 * Version comparison utility for build versions
 */
class VersionUtils {
    /**
     * Compare two version strings numerically
     * Returns true if version1 < version2
     * Supports both integer and semantic version formats
     */
    static isVersionLessThan(version1, version2) {
        // Handle empty or invalid versions
        if (!version1 || !version2) {
            return false;
        }
        // Check if both versions are pure integers (no dots or other characters)
        const isNum1 = /^\d+$/.test(version1.trim());
        const isNum2 = /^\d+$/.test(version2.trim());
        if (isNum1 && isNum2) {
            // Both are pure integers, compare numerically
            return parseInt(version1, 10) < parseInt(version2, 10);
        }
        // Fall back to semantic version comparison
        return this.compareSemanticVersions(version1, version2) < 0;
    }
    /**
     * Compare semantic versions (e.g., "1.2.3" vs "1.2.4")
     * Returns: -1 if v1 < v2, 0 if v1 = v2, 1 if v1 > v2
     */
    static compareSemanticVersions(v1, v2) {
        const parts1 = v1.split('.').map(part => parseInt(part, 10) || 0);
        const parts2 = v2.split('.').map(part => parseInt(part, 10) || 0);
        const maxLength = Math.max(parts1.length, parts2.length);
        for (let i = 0; i < maxLength; i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;
            if (part1 < part2)
                return -1;
            if (part1 > part2)
                return 1;
        }
        return 0;
    }
}
exports.VersionUtils = VersionUtils;
