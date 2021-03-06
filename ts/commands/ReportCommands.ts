import * as caporal from 'caporal';

import ConfigService from '../services/ConfigService';
import NewReportsService from '../services/NewReportsService';
import ReportService from '../services/ReportService';

const configService = new ConfigService();
const reportService = new ReportService();
const newreportsService = new NewReportsService();

class ReportCommands {

  public static addCommands() {
    (caporal as any)
      .command('report list', 'List all reports')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .option('--format <format>', 'format options: text, json', ['text', 'json'], 'text')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        reportService.list(config, logger);
      });

    (caporal as any)
        .command('report ec2rightsizing', 'Retrieve EC2 Right Sizing report')
        .option('--username <username>', 'Metricly Username')
        .option('--password <password>', 'Metricly Password')
        .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
        .option('--format <format>', 'format options: text, json', ['text', 'json'], 'text')
        .option('--rowlimit <rowlimit>', 'row limit: 20, 50, 100', /.*/, '20')
        .action((args, options, logger) => {
          const config = configService.mergeConfig(options);
          newreportsService.ec2rightsizing(config, logger);
        });
  }
}

export default ReportCommands;
