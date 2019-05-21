import * as caporal from 'caporal';

import ConfigService from '../services/ConfigService';
import ElementService from '../services/ElementService';

const configService = new ConfigService();
const elementService = new ElementService();

class ElementCommands {

  public static addCommands() {

    (caporal as any)
      .command('element search', 'Search for Elements')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: table, csv, json', ['table', 'csv', 'json'], 'table')
      .option('--name', 'Name contains')
      .option('--type', 'Element type')
      .option('--attribute', 'Element attribute KEY=VALUE,KEY2=VALUE2')
      .option('--tag', 'Element tag KEY=VALUE,KEY2=VALUE2')
      .option('--collector', 'Datasource collector')
      .option('--page', 'Page number of paginated results')
      .option('--pageSize', 'Page size of paginated results')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        elementService.elementSearch(config, logger);
      });

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

    (caporal as any)
      .command('image custom delete', 'Delete a custom image')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: text, json', ['text', 'json'], 'text')
      .argument('<name>', 'Image Name')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        elementService.customtypeImageRm(args.name, config, logger);
      });

    (caporal as any)
      .command('image custom set', 'Set images for custom element types')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: text, json', ['text', 'json'], 'text')
      .argument('<name>', 'Image Name')
      .argument('<file>', 'Image File Name')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        elementService.customtypeImageSet(args.name, args.file, config, logger);
      });

    (caporal as any)
      .command('image custom list', 'List images for custom element types')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: text, json', ['text', 'json'], 'text')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        elementService.customtypeImageList(config, logger);
      });
  }
}

export default ElementCommands;
