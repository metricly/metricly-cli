import * as caporal from 'caporal';

import PolicyService from '../services/PolicyService';
import CommandUtils from '../util/CommandUtils';

const policyService = new PolicyService();

class PolicyCommands {

  public static addCommands() {
    (caporal as any)
      .command('policy list', 'List all policies')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .action((args, options, logger) => {
        const config = CommandUtils.mergeConfig(options);
        policyService.listAll(config, logger);
      });

    (caporal as any)
      .command('policy get', 'Get a policy by ID')
      .option('--username', 'Metricly Username')
      .option('--password', 'Metricly Password')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .argument('<id>', 'Policy ID')
      .action((args, options, logger) => {
        const config = CommandUtils.mergeConfig(options);
        policyService.getById(args.id, config, logger);
      });
  }
}

export default PolicyCommands;
