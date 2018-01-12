import * as caporal from 'caporal';
import * as path from 'path';

import PackageService from '../services/PackageService';
import CommandUtils from '../util/CommandUtils';
import PackageValidator from '../validation/PackageValidator';

const packageValidator = new PackageValidator();
const packageService = new PackageService();

class PackageCommands {

  public static addCommands() {
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
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .action((args, options, logger) => {
        const config = CommandUtils.mergeConfig(options);
        packageService.listInstalled(config, logger);
      });

    (caporal as any)
      .command('package get', 'Get a package by ID')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .argument('<id>', 'Package Installation ID')
      .action((args, options, logger) => {
        const config = CommandUtils.mergeConfig(options);
        packageService.getById(args.id, config, logger);
      });

    (caporal as any)
      .command('package install', 'Install a package from a Zip URL')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .argument('<url>', 'Package Download URL')
      .action((args, options, logger) => {
        const config = CommandUtils.mergeConfig(options);
        packageService.installFromUrl(args.url, config, logger);
      });

    (caporal as any)
      .command('package uninstall', 'Uninstall a package by ID')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .argument('<id>', 'Package Installation ID')
      .action((args, options, logger) => {
        const config = CommandUtils.mergeConfig(options);
        packageService.uninstallById(args.id, config, logger);
      });
  }
}

export default PackageCommands;
