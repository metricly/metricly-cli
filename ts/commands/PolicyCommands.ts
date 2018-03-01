import * as caporal from 'caporal';

import ConfigService from '../services/ConfigService';
import PolicyService from '../services/PolicyService';

const configService = new ConfigService();
const policyService = new PolicyService();

class PolicyCommands {

  public static addCommands() {
    (caporal as any)
      .command('policy list', 'List all policies')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: text, json', ['text', 'json'], 'text')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        policyService.listAll(config, logger);
      });

    (caporal as any)
      .command('policy get', 'Get a policy by ID')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .option('--format', 'output format: text, json', ['text', 'json'], 'text')
      .argument('<id>', 'Policy ID')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        policyService.getById(args.id, config, logger);
      });
  }
}

export default PolicyCommands;
