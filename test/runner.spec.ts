import { spawn } from 'child_process';

jest.setTimeout(10000);

type Testcase = {
  command: string;
  script: string;
  silent?: boolean;
  parallel?: boolean;
  args?: string[];
  directories: string[];
  minRuntime?: number;
  maxRuntime?: number;
};

const testcases: Testcase[] = [
  {
    command: 'npm',
    script: 'sleep',
    silent: true,
    directories: ['test/lib1'],
    minRuntime: 1000,
    maxRuntime: 2000,
  },
  {
    command: 'yarn',
    script: 'sleep',
    directories: ['test/lib1'],
    minRuntime: 1000,
    maxRuntime: 2000,
  },
  {
    command: 'npm',
    script: 'sleep',
    directories: ['test/lib1'],
    minRuntime: 1000,
    maxRuntime: 2000,
  },
  {
    command: 'yarn',
    script: 'sleep',
    directories: ['test/lib1', 'test/lib2', 'test/lib3'],
    minRuntime: 6000,
    maxRuntime: 7000,
  },
  {
    command: 'yarn',
    script: 'sleep',
    parallel: true,
    directories: ['test/lib1', 'test/lib2', 'test/lib3'],
    minRuntime: 3000,
    maxRuntime: 4000,
  },
  {
    command: 'yarn',
    script: 'echo',
    args: ['first', 'second'],
    directories: ['test/lib1', 'test/lib2', 'test/lib3'],
  },
  {
    command: 'npm',
    script: 'sleep',
    directories: ['test/lib1', 'test/lib2', 'test/lib3'],
    minRuntime: 6000,
    maxRuntime: 7000,
  },
  {
    command: 'npm',
    script: 'sleep',
    parallel: true,
    directories: ['test/lib1', 'test/lib2', 'test/lib3'],
    minRuntime: 3000,
    maxRuntime: 4000,
  },
  {
    command: 'npm',
    script: 'echo',
    args: ['first', 'second'],
    directories: ['test/lib1', 'test/lib2', 'test/lib3'],
  },
];

function getTestName({
  command,
  script,
  silent,
  parallel,
  args,
  directories,
}: Testcase) {
  return `should run script '${script}' using '${command}' ${
    silent ? 'silently and ' : ''
  }${parallel ? 'in parallel' : 'sequentially'} ${
    args?.length ? 'using args ' : ''
  }in ${
    directories.length > 1 ? 'multiple directories' : 'a single directory'
  }`;
}

describe('Runner', () => {
  testcases.forEach((testcase) => {
    it(getTestName(testcase), (done) => {
      const {
        command,
        script,
        silent,
        parallel,
        args,
        directories,
        maxRuntime,
        minRuntime,
      } = testcase;

      const startTime = Date.now();
      let output = '';

      const child = spawn(
        'yarn',
        [
          'start:prod',
          command === 'yarn' ? '-y' : '',
          silent ? '-s' : '',
          parallel ? '-p' : '',
          args?.length ? `-a "${args.join(' ')}"` : '',
          script,
          ...directories,
        ].filter(Boolean),
        {
          cwd: process.cwd(),
        },
      );

      child.stdout.on('data', (chunk) => (output += chunk.toString()));

      child.on('exit', (exitCode) => {
        expect(exitCode).toBe(0);

        if (minRuntime && maxRuntime) {
          const runTime = Date.now() - startTime;
          expect(runTime).toBeGreaterThan(minRuntime);
          expect(runTime).toBeLessThan(maxRuntime);
        }

        done();
      });
    });
  });
});
