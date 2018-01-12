import * as caporal from 'caporal';

import DashboardService from '../services/DashboardService';
import CommandUtils from '../util/CommandUtils';

const dashboardService = new DashboardService();

class PolicyCommands {

  public static addCommands() {
    (caporal as any)
      .command('dashboard list', 'List all dashboards')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .action((args, options, logger) => {
        const config = CommandUtils.mergeConfig(options);
        dashboardService.list(config, logger);
      });

    (caporal as any)
      .command('dashboard get', 'Get a dashboard by ID')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .argument('<id>', 'Dashboard ID')
      .action((args, options, logger) => {
        const config = CommandUtils.mergeConfig(options);
        dashboardService.getById(args.id, config, logger);
      });
  }
}

export default PolicyCommands;
