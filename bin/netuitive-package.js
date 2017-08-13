#! /usr/bin/env node

var path = require('path');
var fs = require('fs');
var inquirer = require('inquirer');
var extend = require('extend');
var pkg = require('../package.json');

var validator = require('../validation/package');
var packageService = require('../packageService/index');

var prog = require('caporal');
prog
  .version(pkg.version)
  .description(pkg.description);

prog.command('config', 'Set local defaults')
  .action(function(args, options, logger) {
    var config = mergeConfig({});
    inquirer.prompt([{
      type: 'input',
      name: 'tenantId',
      message: 'Tenant Id',
      default: config.tenantId
    }, {
      type: 'input',
      name: 'endpoint',
      message: 'Package Endpoint',
      default: config.endpoint || 'https://pkg.app.netuitive.com'
    }]).then(answers => {
      var location = process.env.HOME + '/.netuitive-package-cli.json';
      fs.writeFileSync(location, JSON.stringify(answers, 'UTF-8', 2));
    });
  });

prog.command('validate', 'Validate a local package')
  .option('--location <location>', 'Path to package', /.*/, '.')
  .action(function(args, options, logger) {
    var location = path.resolve(process.cwd(), options.location);
    validator.validate(location, require(location + '/package.json').id);
  });

prog.command('list', 'List installed packages')
  .action(function(args, options, logger) {
    var config = mergeConfig(options);
    packageService.listInstalled(config, logger);
  });

prog.command('updatable', 'List updatable packages')
  .action(function(args, options, logger) {
    var config = mergeConfig(options);
    packageService.listUpdatable(config, logger);
  });

prog.command('deploy', 'Deploy a local package to a tenant')
  .option('--location <location>', 'Path to package', /.*/, '.')
  .option('--endpoint <endpoint>', 'Package endpoint (overrides config)', /.*/)
  .option('--tenant-id <tenant-id>', 'Tenant ID (overrides config)', /.*/)
  .action(function(args, options, logger) {
    var location = path.resolve(process.cwd(), options.location);
    validator.validate(location, require(location + '/package.json').id, true);
    packageService.deploy(mergeConfig(options), logger, location).catch(e => {
      logger.error('Error deploying package', e);
    });
  });

prog.parse(process.argv);

function mergeConfig(options) {
  var location = process.env.HOME + '/.netuitive-package-cli.json';
  var config = fs.existsSync(location) ? JSON.parse(fs.readFileSync(location)) : {};
  return extend({}, config, options);
}
