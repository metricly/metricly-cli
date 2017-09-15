#! /usr/bin/env node

var path = require('path');
var pkg = require('../package.json');
var validator = require('../validation/package');

var prog = require('caporal');
prog
  .version(pkg.version)
  .description(pkg.description)
  .option('--location <location>', 'Path to package', /.*/, '.')
  .action(function(args, options, logger) {
    var location = path.resolve(process.cwd(), options.location);
    validator.validate(location, require(location + '/package.json').id);
  });

prog.parse(process.argv);
