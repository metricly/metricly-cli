# Metricly CLI
Official Metricly command line utility

## Use

Attached to the [latest GitHub release](https://github.com/metricly/metricly-cli/releases/latest) there are binaries for Mac, Windows, and Linux. Download the binary for your system, add it to your path, make it executable, and run `metricly -h`.

### NPM

```
npm i -g metricly-cli
metricly -h
```

## Development

```
npm i -g yarn
git clone https://github.com/metricly/metricly-cli.git
cd metricly-cli/
yarn

// Compile and run Node
yarn run compile
node js/bin/metricly.js

// Run directly with TypeScript
npm install -g ts-node
ts-node ts/bin/metricly.ts
```

## Docker

```
// Build and run / develop as a docker container
docker build -t metricly-cli .

// Run it as a docker command
docker run -it -v ~/.metricly-cli.json:/root/.metricly-cli.json:rw metricly-cli

// Use it as an alias. Edit ~/.bash_profile and add:
alias metricly-cli="docker run -it -v ~/.metricly-cli.json:/root/.metricly-cli.json:rw metricly-cli"

$ metricly-cli

   metricly.js 0.1.0 - Metricly CLI

   USAGE

     metricly.js <command> [options]

   COMMANDS

     config                      Set local defaults
     package validate            Validate a local package
     package list                List installed packages
     package get <id>            Get a package by ID
     package install <url>       Install a package from a Zip URL
     package uninstall <id>      Uninstall a package by ID
     policy list                 List all policies
     policy get <id>             Get a policy by ID
     dashboard list              List all dashboards
     dashboard get <id>          Get a dashboard by ID
     help <command>              Display help for a specific command

   GLOBAL OPTIONS

     -h, --help         Display help
     -V, --version      Display version
     --no-color         Disable colors
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages

```
