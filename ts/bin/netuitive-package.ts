#! /usr/bin/env node

import * as path from 'path';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as extend from 'extend';
import * as prog from 'caporal';

import PackageValidator from '../validation/PackageValidator';
import PackageService from '../services/PackageService';

var pkg = require('../../package.json');

var packageValidator = new PackageValidator();
var packageService = new PackageService();

prog
  .version(pkg.version)
  .description(pkg.description);

prog.command('config', 'Set local defaults')
  .action(function(args, options, logger) {
    var config = mergeConfig({});
    inquirer.prompt([{
      type: 'input',
      name: 'username',
      message: 'Metricly Username',
      default: config.username
    }, {
      type: 'input',
      name: 'password',
      message: 'Metricly Password',
      default: config.password
    }, {
      type: 'input',
      name: 'endpoint',
      message: 'Metricly Endpoint',
      default: config.endpoint || 'https://app.netuitive.com'
    }]).then(answers => {
      var location = process.env.HOME + '/.netuitive-package-cli.json';
      fs.writeFileSync(location, JSON.stringify(answers, null, 2));
    });
  });

prog.command('validate', 'Validate a local package')
  .option('--location <location>', 'Path to package', /.*/, '.')
  .action(function(args, options, logger) {
    var location: string = path.resolve(process.cwd(), options.location);
    packageValidator.validate(location, require(location + '/package.json').id);
  });

prog.command('list', 'List installed packages')
  .option('--username', 'Metricly Username')
  .option('--password', 'Metricly Password')
  .action(function(args, options, logger) {
    var config = mergeConfig(options);
    packageService.listInstalled(config, logger);
  });

prog.command('get', 'Get a package by ID')
  .option('--username', 'Metricly Username')
  .option('--password', 'Metricly Password')
  .argument('<id>', 'Package Installation ID')
  .action(function(args, options, logger) {
    var config = mergeConfig(options);
    packageService.getById(args.id, config, logger);
  });

prog.command('install', 'Install a package from a Zip URL')
  .option('--username', 'Metricly Username')
  .option('--password', 'Metricly Password')
  .argument('<url>', 'Package Download URL')
  .action(function(args, options, logger) {
    var config = mergeConfig(options);
    packageService.installFromUrl(args.url, config, logger);
  });

prog.command('uninstall', 'Uninstall a package by ID')
  .option('--username', 'Metricly Username')
  .option('--password', 'Metricly Password')
  .argument('<id>', 'Package Installation ID')
  .action(function(args, options, logger) {
    var config = mergeConfig(options);
    packageService.uninstallById(args.id, config, logger);
  });

prog.parse(process.argv);

function mergeConfig(options) {
  var location = process.env.HOME + '/.netuitive-package-cli.json';
  var config = fs.existsSync(location) ? JSON.parse((fs.readFileSync(location).toString())) : {};
  return extend({}, config, options);
}
