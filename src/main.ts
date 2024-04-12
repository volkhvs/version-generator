import * as core from '@actions/core';

type IncrementType = 'major' | 'minor' | 'patch';

async function run() {
  try {
    const incrementType = parseIncrementType(
      core.getInput('increment_type', { required: true }),
    );
    const currentVersion = core.getInput('current_version', { required: true });

    core.info(
      `Generating new version for increment type ${incrementType} and current version ${currentVersion}.`,
    );
    const version = incrementSemVer(incrementType, currentVersion);
    core.info(`Generated new version ${version}.`);

    core.setOutput('version', version);
  } catch (error: unknown) {
    core.setFailed(error as Error);
  }
}

function parseIncrementType(input: string): IncrementType {
  const validTypes: IncrementType[] = ['major', 'minor', 'patch'];
  if (validTypes.includes(input as IncrementType)) {
    return input as IncrementType;
  }
  throw new Error(`Invalid increment type: ${input}`);
}

function incrementSemVer(
  incrementType: IncrementType,
  currentVersion: string,
): string {
  // Separate prefix from version numbers
  const versionMatch = currentVersion.match(/(.*?)(\d+\.\d+\.\d+)$/);
  if (!versionMatch) {
    throw new Error(
      'Invalid version format. Expected format: [prefix]x.y.z where x, y, z are integers.',
    );
  }

  const [, prefix, version] = versionMatch;

  // If the current version is 0.0.0, return 1.0.0
  if (version === '0.0.0') {
    return `${prefix}1.0.0`;
  }

  // Split version into major, minor, and patch
  const parts = version.split('.').map((part) => parseInt(part, 10));
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(
      'Invalid version format. Expected format: x.y.z where x, y, z are integers.',
    );
  }

  let [major, minor, patch] = parts;

  switch (incrementType) {
    case 'major':
      major++;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor++;
      patch = 0;
      break;
    case 'patch':
      patch++;
      break;
    default:
      throw new Error(`Unknown increment type: ${incrementType}`);
  }

  return `${prefix}${major}.${minor}.${patch}`;
}

export default run;
