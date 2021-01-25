# run-in-all

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e23780d240d14864b9b790983888ef79)](https://app.codacy.com/gh/bacali95/run-in-all?utm_source=github.com&utm_medium=referral&utm_content=bacali95/run-in-all&utm_campaign=Badge_Grade_Settings)
[![npm version](https://badge.fury.io/js/run-in-all.svg)](https://badge.fury.io/js/run-in-all)

A CLI tool to run the same npm-script in multiple directories in parallel or sequential.

Ex: `run-in-all --yarn --parallel build server client test`

## Usage
```
run-in-all [command] [directories...]

Options:
      --help      Show help                                                                  [boolean]
      --version   Show version number                                                        [boolean]
  -a, --args      Run the command with args.                                    [string] [default: ""]
  -p, --parallel  Run the command in all directories in parallel.           [boolean] [default: false]
  -s, --silent    Run the command silently, without the command output.     [boolean] [default: false]
  -y, --yarn      Run the command with yarn.                                [boolean] [default: false]
```
