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
      .command('report ec2cost', 'Retrieve ec2 cost data grouped and aggregated.')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'format options: text, json', ['text', 'json'], 'text')
      .option('--period', 'relative period options: latestDay, monthToDate, lastMonth', ['latestDay', 'monthToDate', 'lastMonth'], 'latestDay')
      .option('--groupby', 'groupby options: elementName, givenKey', ['elementName', 'givenKey'], 'elementName')
      .option('--groupbykey', 'groupbykey options: instanceType, accountId, availabilityZone', ['instanceType', 'accountId', 'availabilityZone'], 'instanceType')
      .option('--rowlimit', 'row limit: 20, 50, 100', /.*/, '20')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        reportService.ec2cost(config, logger);
      });

  }
}

export default ReportCommands;
