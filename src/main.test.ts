import * as core from '@actions/core';
import run from './main';

jest.mock('@actions/core');

function mockForInput(incrementType: string, currentVersion: string): void {
  jest
    .spyOn(core, 'getInput')
    .mockReturnValueOnce(incrementType)
    .mockReturnValueOnce(currentVersion);
}

describe('run', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('increments minor version correctly', async () => {
    mockForInput('minor', 'v1.2.3');
    await run();
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith('version', 'v1.3.0');
  });

  it('increments major version correctly', async () => {
    mockForInput('major', 'version2.4.7');
    await run();
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith('version', 'version3.0.0');
  });

  it('increments patch version correctly', async () => {
    mockForInput('patch', '1.2.3');
    await run();
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith('version', '1.2.4');
  });

  it('handles custom prefix correctly', async () => {
    mockForInput('patch', 'release-1.5.9');
    await run();
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith('version', 'release-1.5.10');
  });

  it('returns 1.0.0 for initial version 0.0.0', async () => {
    mockForInput('minor', '0.0.0');
    await run();
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith('version', '1.0.0');
  });

  it('throws error for invalid version format', async () => {
    mockForInput('minor', 'invalid.version');
    await run();
    expect(core.setFailed).toHaveBeenCalledWith(
      new Error(
        'Invalid version format. Expected format: [prefix]x.y.z where x, y, z are integers.',
      ),
    );
    expect(core.setOutput).not.toHaveBeenCalled();
  });

  it('throws error for unknown increment type', async () => {
    mockForInput('unknown', '1.2.3');
    await run();
    expect(core.setFailed).toHaveBeenCalledWith(
      new Error('Invalid increment type: unknown'),
    );
    expect(core.setOutput).not.toHaveBeenCalled();
  });

  it('returns 1.0.0 for initial version 0.0.0 and prefix', async () => {
    mockForInput('patch', 'test-0.0.0');
    await run();
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith('version', 'test-1.0.0');
  });
});
