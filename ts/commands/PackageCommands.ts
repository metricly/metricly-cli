import * as caporal from 'caporal';
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
      .argument('<url>', 'Package Download URL')
      .argument('<file>', 'Package File to install')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        if (args.file) {
          packageService.installFromFile(args.file, config, logger);
        } else {
          packageService.installFromUrl(args.url, config, logger);
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
