#! /usr/bin/env node

var path = require('path');
var fs = require('fs');
var inquirer = require('inquirer');
var pkg = require('../package.json');

var validator = require('../validation/package');
var deploy = require('../deploy/index');

var prog = require('caporal');
prog
  .version(pkg.version)
  .description(pkg.description);

prog.command('configure')
  .action(function(args, options, logger) {
    var location = process.env.HOME + '/.netuitive-package-cli.json';
    var config = fs.existsSync(location) ? JSON.parse(fs.readFileSync(location)) : {};
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
      fs.writeFileSync(location, JSON.stringify(answers, 'UTF-8', 2));
    });
  });

prog.command('validate')
  .option('--location <location>', 'Path to package', /.*/, '.')
  .action(function(args, options, logger) {
    var location = path.resolve(process.cwd(), options.location);
    validator.validate(location, require(location + '/package.json').id);
  });

prog.command('deploy')
  .option('--location <location>', 'Path to package', /.*/, '.')
  .action(function(args, options, logger) {
    var location = path.resolve(process.cwd(), options.location);
    validator.validate(location, require(location + '/package.json').id, true);
    deploy(location);
  });

prog.parse(process.argv);
