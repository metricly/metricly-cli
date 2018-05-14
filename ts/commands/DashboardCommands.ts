import * as caporal from 'caporal';

import ConfigService from '../services/ConfigService';
import DashboardService from '../services/DashboardService';

const configService = new ConfigService();
const dashboardService = new DashboardService();

class DashboardCommands {

  public static addCommands() {
    (caporal as any)
      .command('dashboard list', 'List all dashboards')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: text, json', ['text', 'json'], 'text')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        dashboardService.list(config, logger);
      });

    (caporal as any)
      .command('dashboard get', 'Get a dashboard by ID')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: text, json', ['text', 'json'], 'text')
      .argument('<id>', 'Dashboard ID')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        dashboardService.getById(args.id, config, logger);
      });

    (caporal as any)
      .command('dashboard create', 'Create a new dashboard from a local JSON file')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .argument('<file>', 'JSON dashboard file location')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        dashboardService.create(args.file, config, logger);
      });

    (caporal as any)
      .command('dashboard update', 'Update a dashboard from a local JSON file')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .argument('<id>', 'Dashboard ID')
      .argument('<file>', 'JSON dashboard file location')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        dashboardService.update(args.id, args.file, config, logger);
      });

    (caporal as any)
      .command('dashboard delete', 'Delete a dashboard by ID')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .argument('<id>', 'Dashboard ID')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        dashboardService.deleteById(args.id, config, logger);
      });
  }
}

export default DashboardCommands;
