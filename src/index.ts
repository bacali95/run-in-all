#!/usr/bin/env node
import * as yargs from 'yargs';
import { runCommandInDirs } from './runner';

const options = yargs
  .usage('run-in-all [command] [directories...]')
  .option('p', {
    alias: 'parallel',
    describe: 'Run the command in all directories in parallel.',
    type: 'boolean',
    demandOption: false,
    default: false,
  })
  .option('s', {
    alias: 'silent',
    describe: 'Run the command silently, without the command output.',
    type: 'boolean',
    demandOption: false,
    default: false,
  })
  .option('n', {
    alias: 'npm',
    describe: 'Run the command with npm.',
    type: 'boolean',
    demandOption: false,
    default: false,
  }).argv;

const [command, ...directories] = options._ as string[];

runCommandInDirs(command, directories, {
  isNpm: options.n,
  parallel: options.p,
  silent: options.s,
}).then(process.exit);
