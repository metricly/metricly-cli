import * as caporal from 'caporal';

import ConfigService from '../services/ConfigService';
import ReportService from '../services/ReportService';

const configService = new ConfigService();
const reportService = new ReportService();

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
      .command('report ec2cost', 'Retrieve ec2 cost data grouped and aggregated.')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .option('--format <format>', 'format options: text, json', ['text', 'json'], 'text')
      .option('--period <period>', 'relative period options: latestDay, monthToDate, lastMonth', ['latestDay', 'monthToDate', 'lastMonth'], 'latestDay')
      .option('--groupby <groupby>', 'groupby options: elementName, givenKey', ['elementName', 'givenKey'], 'elementName')
      .option('--groupbykey <groupbykey>', 'groupbykey options: instanceType, accountId, availabilityZone', ['instanceType', 'accountId', 'availabilityZone'], 'instanceType')
      .option('--rowlimit <rowlimit>', 'row limit: 20, 50, 100', /.*/, '20')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        reportService.ec2cost(config, logger);
      });

    (caporal as any)
        .command('report ec2recommendation', 'Retrieve EC2 recommendation data grouped and aggregated.')
        .option('--username <username>', 'Metricly Username')
        .option('--password <password>', 'Metricly Password')
        .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
        .option('--format <format>', 'format options: text, json', ['text', 'json'], 'text')
        .option('--rowlimit <rowlimit>', 'row limit: 20, 50, 100', /.*/, '20')
        .action((args, options, logger) => {
          const config = configService.mergeConfig(options);
          reportService.ec2recommendation(config, logger);
        });

  }
}

export default ReportCommands;
