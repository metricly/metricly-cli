#! /usr/bin/env node

import * as caporal from 'caporal';
import * as extend from 'extend';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as path from 'path';

import PackageService from '../services/PackageService';
import PolicyService from '../services/PolicyService';
import PackageValidator from '../validation/PackageValidator';

// tslint:disable-next-line:no-var-requires
const pkg = require('../../package.json');

const packageValidator = new PackageValidator();
const packageService = new PackageService();
const policyService = new PolicyService();

(caporal as any)
  .version(pkg.version)
  .description(pkg.description);

(caporal as any)
  .command('config', 'Set local defaults')
  .action((args, options, logger) => {
    const config = mergeConfig({});
    inquirer.prompt([{
      default: config.username,
      message: 'Metricly Username',
      name: 'username',
      type: 'input'
    }, {
      default: config.password,
      message: 'Metricly Password',
      name: 'password',
      type: 'input'
    }, {
      default: config.endpoint || 'https://app.netuitive.com',
      message: 'Metricly Endpoint',
      name: 'endpoint',
      type: 'input'
    }]).then((answers) => {
      const location = process.env.HOME + '/.metricly-cli.json';
      fs.writeFileSync(location, JSON.stringify(answers, null, 2));
    });
  });

(caporal as any)
  .command('package validate', 'Validate a local package')
  .option('--location <location>', 'Path to package', /.*/, '.')
  .action((args, options, logger) => {
    const location: string = path.resolve(process.cwd(), options.location);
    packageValidator.validate(location, require(location + '/package.json').id);
  });

(caporal as any)
  .command('package list', 'List installed packages')
  .option('--username', 'Metricly Username')
  .option('--password', 'Metricly Password')
  .action((args, options, logger) => {
    const config = mergeConfig(options);
    packageService.listInstalled(config, logger);
  });

(caporal as any)
  .command('package get', 'Get a package by ID')
  .option('--username', 'Metricly Username')
  .option('--password', 'Metricly Password')
  .argument('<id>', 'Package Installation ID')
  .action((args, options, logger) => {
    const config = mergeConfig(options);
    packageService.getById(args.id, config, logger);
  });

(caporal as any)
  .command('package install', 'Install a package from a Zip URL')
  .option('--username', 'Metricly Username')
  .option('--password', 'Metricly Password')
  .argument('<url>', 'Package Download URL')
  .action((args, options, logger) => {
    const config = mergeConfig(options);
    packageService.installFromUrl(args.url, config, logger);
  });

(caporal as any)
  .command('package uninstall', 'Uninstall a package by ID')
  .option('--username', 'Metricly Username')
  .option('--password', 'Metricly Password')
  .argument('<id>', 'Package Installation ID')
  .action((args, options, logger) => {
    const config = mergeConfig(options);
    packageService.uninstallById(args.id, config, logger);
  });

(caporal as any)
  .command('policy list', 'List all policies')
  .option('--username', 'Metricly Username')
  .option('--password', 'Metricly Password')
  .action((args, options, logger) => {
    const config = mergeConfig(options);
    policyService.listAll(config, logger);
  });

(caporal as any).parse(process.argv);

function mergeConfig(options) {
  const location = process.env.HOME + '/.metricly-cli.json';
  const config = fs.existsSync(location) ? JSON.parse((fs.readFileSync(location).toString())) : {};
  return extend({}, config, options);
}
