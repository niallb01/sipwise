const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Disable package exports to avoid import.meta issues
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
