import * as caporal from 'caporal';

import ConfigService from '../services/ConfigService';
import ElementService from '../services/ElementService';

const configService = new ConfigService();
const elementService = new ElementService();

class ElementCommands {

  public static addCommands() {

    (caporal as any)
      .command('maintenance list', 'List elements in maintenance mode')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: text, json', ['text', 'json'], 'text')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        elementService.lsMaintenanceMode(config, logger);
      });

    (caporal as any)
      .command('maintenance start', 'Start maintenance mode on an Element')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: text, json', ['text', 'json'], 'text')
      .argument('<id>', 'Element ID')
      .option('--hours', 'Duration for element to be in maintenance, leave blank for forever')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        elementService.startMaintenanceMode(args.id, config, logger);
      });

    (caporal as any)
      .command('maintenance stop', 'Stop maintenance mode on an Element')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: text, json', ['text', 'json'], 'text')
      .argument('<id>', 'Element ID')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        elementService.stopMaintenanceMode(args.id, config, logger);
      });
  }
}

export default ElementCommands;
