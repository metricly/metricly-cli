import * as caporal from 'caporal';

import ConfigService from '../services/ConfigService';
import ReportService from '../services/ReportService';

const configService = new ConfigService();
const reportService = new ReportService();

class ReportCommands {

  public static addCommands() {
    (caporal as any)
      .command('report list', 'List all reports')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'format options: text, json', ['text', 'json'], 'text')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        reportService.list(config, logger);
      });

    (caporal as any)
      .command('report getEC2CostData', 'Get EC2 Cost Data')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'format options: text, json', ['text', 'json'], 'text')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        reportService.getEC2CostData(config, logger);
      });

  }
}

export default ReportCommands;
