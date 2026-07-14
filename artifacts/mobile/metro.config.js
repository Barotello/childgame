const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
// pnpm workspace root (Word-Builder-Kids/)
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Allow Metro to follow pnpm symlinks into the workspace store
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Explicit resolution for packages that live only via pnpm symlinks
// (helps when Metro fails to walk outside the package folder).
const localSpeech = path.resolve(projectRoot, 'node_modules/expo-speech');
if (fs.existsSync(localSpeech)) {
  config.resolver.extraNodeModules = {
    ...(config.resolver.extraNodeModules || {}),
    'expo-speech': fs.realpathSync(localSpeech),
  };
}

module.exports = config;
