const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
// pnpm workspace root (Word-Builder-Kids/)
const monorepoRoot = path.resolve(projectRoot, '../..');

// Expo 54 discovers pnpm workspaces automatically. Keeping Metro's workspace
// root intact is important because pnpm's real package files live there.
const config = getDefaultConfig(projectRoot);

// Exclude Replit agent/skill directories — they contain temp files that can
// disappear mid-watch and crash Metro with ENOENT.
const BLOCKED_PATHS = [
  ...['.local', '.agents', '.cache', '.git', '.tools'].map(directory =>
    path.resolve(monorepoRoot, directory)
  ),
  path.resolve(projectRoot, 'ios'),
  path.resolve(projectRoot, 'dist'),
];
config.resolver.blockList = new RegExp(
  BLOCKED_PATHS.map(blockedPath =>
    `^${blockedPath.replace(/[/\\]/g, '[/\\\\]')}.*`
  ).join('|')
);

module.exports = config;
