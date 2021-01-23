import { green, red, yellow } from 'chalk';
import { exec } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import logger from './logger';

type RunOptions = {
  isNpm?: boolean;
  silent?: boolean;
  parallel?: boolean;
};

/**
 * Run command in directories using options
 * @param command       The command to run
 * @param directories   The directories to run the command in
 * @param options       The options to decide to tun the command silently, in parallel and with npm or yarn
 */
export async function runCommandInDirs(
  command: string,
  directories: string[],
  options: RunOptions,
): Promise<number> {
  if (options.parallel) {
    return await Promise.all(
      directories.map((directory) =>
        runCommandInDir(command, directory, options),
      ),
    ).then((exitCodes) => exitCodes.sort().pop() ?? 0);
  }

  let maxExitCode = 0;
  for (const directory of directories) {
    maxExitCode = Math.max(
      maxExitCode,
      await runCommandInDir(command, directory, options),
    );
  }
  return maxExitCode;
}

function runCommandInDir(
  command: string,
  directory: string,
  options: RunOptions,
): Promise<number> {
  const { isNpm, silent } = options;
  const isInstallCommand = command === 'install';

  if (!existsSync(directory)) {
    logger.error(`Directory '${directory}' not found!`, directory);
    return;
  }

  const packageFilePath = join(directory, 'package.json');
  if (!existsSync(packageFilePath)) {
    logger.error(`File '${directory}/package.json' not found!`, directory);
    return;
  }

  const packageFile = JSON.parse(readFileSync(packageFilePath).toString());
  if (
    !isInstallCommand &&
    (!packageFile.scripts || !packageFile.scripts[command])
  ) {
    logger.error(
      `Command '${command}' not found in '${directory}/package.json'!`,
      directory,
    );
    return;
  }

  const fullCmd = isNpm
    ? `npm ${isInstallCommand ? '' : 'run'} ${command} --prefix ${directory}`
    : `yarn --cwd ${directory} ${isInstallCommand ? '' : 'run'} ${command}`;

  logger.log(yellow.bold(fullCmd), directory);
  return new Promise<number>((resolve) => {
    const child = exec(fullCmd);

    if (!silent) {
      child.stdout?.on('data', (chunk) =>
        logger.log(Buffer.from(chunk).toString(), directory),
      );
      child.stderr?.on('data', (chunk) =>
        logger.error(Buffer.from(chunk).toString(), directory),
      );
    }

    child.on('exit', resolve);
  });
}
