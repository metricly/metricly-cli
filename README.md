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

## Testing
// run tests
```yarn test```
// continuous testing
```yarn run watch```


