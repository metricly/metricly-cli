import * as caporal from 'caporal';
import isUrl = require('is-url');
import * as path from 'path';

import ConfigService from '../services/ConfigService';
import PackageService from '../services/PackageService';
import PackageValidator from '../validation/PackageValidator';

const configService = new ConfigService();
const packageValidator = new PackageValidator();
const packageService = new PackageService();

class PackageCommands {

  public static addCommands() {
    (caporal as any)
      .command('package validate', 'Validate a local package')
      .option('--location <location>', 'Path to package, default is cwd', /.*/, '.')
      .action((args, options, logger) => {
        const location: string = path.resolve(process.cwd(), options.location);
        packageValidator.validate(location, require(location + '/package.json').id);
      });

    (caporal as any)
    .command('package create', 'Create a local pkg.zip')
    .option('--location <location>', 'Path to save pkg.zip, default is cwd', /.*/, '.')
    .action((args, options, logger) => {
      const location: string = path.resolve(process.cwd(), options.location);
      const config = configService.mergeConfig(options);
      packageService.createArchive(location, config, logger);
    });

    (caporal as any)
      .command('package format', 'Format the package')
      .option('--location <location>', 'Path to the package directory, default is cwd', /.*/, '.')
      .action((args, options, logger) => {
        const location: string = path.resolve(process.cwd(), options.location);
        const config = configService.mergeConfig(options);
        packageService.format(location, config, logger);
      });

    (caporal as any)
      .command('package lint', 'Lint the package, returns with an error if any files are not formatted')
      .option('--location <location>', 'Path to the package directory, default is cwd', /.*/, '.')
      .action((args, options, logger) => {
        const location: string = path.resolve(process.cwd(), options.location);
        const config = configService.mergeConfig(options);
        const errors = packageService.lint(location, config, logger);
        if (errors.length !== 0) {
          logger.error(`The following files are not formatted:\n${errors.join('\n')}`);
          process.exit(1);
        }
        logger.info(`The package at ${location} is properly formatted`);
      });

    (caporal as any)
      .command('package list', 'List installed packages')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        packageService.listInstalled(config, logger);
      });

    (caporal as any)
      .command('package get', 'Get a package by ID')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .argument('<id>', 'Package Installation ID')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        packageService.getById(args.id, config, logger);
      });

    (caporal as any)
      .command('package install', 'Install a package from a Zip URL or File')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .argument('<url-or-file>', 'Package Download URL or file')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        if (isUrl(args.urlOrFile)) {
          packageService.installFromUrl(args.urlOrFile, config, logger);
        } else {
          packageService.installFromFile(args.urlOrFile, config, logger);
        }
      });

    (caporal as any)
      .command('package uninstall', 'Uninstall a package by ID')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .argument('<id>', 'Package Installation ID')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        packageService.uninstallById(args.id, config, logger);
      });
  }
}

export default PackageCommands;
