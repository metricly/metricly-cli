import * as caporal from 'caporal';

import ConfigService from '../services/ConfigService';
import ElementService from '../services/ElementService';

const configService = new ConfigService();
const elementService = new ElementService();

class ElementCommands {

  public static addCommands() {

    (caporal as any)
      .command('element search', 'Search for Elements')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .option('--format <format>', 'output format: table, csv, json', ['table', 'csv', 'json'], 'table')
      .option('--name <name>', 'Name contains')
      .option('--type <type>', 'Element type')
      .option('--attribute <attribute>', 'Element attribute KEY=VALUE,KEY2=VALUE2')
      .option('--tag <tag>', 'Element tag KEY=VALUE,KEY2=VALUE2')
      .option('--collector <collector>', 'Datasource collector')
      .option('--page <page>', 'Page number of paginated results')
      .option('--pageSize <pageSize>', 'Page size of paginated results')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        elementService.elementSearch(config, logger);
      });

    (caporal as any)
      .command('maintenance list', 'List elements in maintenance mode')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .option('--format <format>', 'output format: text, json', ['text', 'json'], 'text')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        elementService.lsMaintenanceMode(config, logger);
      });

    (caporal as any)
      .command('maintenance start', 'Start maintenance mode on an Element')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .option('--format <format>', 'output format: text, json', ['text', 'json'], 'text')
      .argument('<id>', 'Element ID')
      .option('--hours <hours>', 'Duration for element to be in maintenance, leave blank for forever')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        elementService.startMaintenanceMode(args.id, config, logger);
      });

    (caporal as any)
      .command('maintenance stop', 'Stop maintenance mode on an Element')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .option('--format <format>', 'output format: text, json', ['text', 'json'], 'text')
      .argument('<id>', 'Element ID')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        elementService.stopMaintenanceMode(args.id, config, logger);
      });
  }
}

export default ElementCommands;
