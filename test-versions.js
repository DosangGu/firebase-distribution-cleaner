import { VersionUtils } from './src/version-utils';

// Test version comparison logic
console.log('Testing version comparison logic:');

// Test numeric versions
console.log('100 < 200:', VersionUtils.isVersionLessThan('100', '200')); // true
console.log('200 < 100:', VersionUtils.isVersionLessThan('200', '100')); // false
console.log('100 < 100:', VersionUtils.isVersionLessThan('100', '100')); // false

// Test semantic versions
console.log('1.0.0 < 1.0.1:', VersionUtils.isVersionLessThan('1.0.0', '1.0.1')); // true
console.log('1.0.1 < 1.0.0:', VersionUtils.isVersionLessThan('1.0.1', '1.0.0')); // false
console.log('1.0.0 < 1.1.0:', VersionUtils.isVersionLessThan('1.0.0', '1.1.0')); // true
console.log('2.0.0 < 1.9.9:', VersionUtils.isVersionLessThan('2.0.0', '1.9.9')); // false

// Test mixed versions
console.log('10 < 1.0.0:', VersionUtils.isVersionLessThan('10', '1.0.0')); // false (falls back to semantic)
console.log('1.0.0 < 10:', VersionUtils.isVersionLessThan('1.0.0', '10')); // true (falls back to semantic)
