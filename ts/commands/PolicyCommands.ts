import * as caporal from 'caporal';

import ConfigService from '../services/ConfigService';
import PolicyService from '../services/PolicyService';

const configService = new ConfigService();
const policyService = new PolicyService();

class PolicyCommands {

  public static addCommands() {
    (caporal as any)
      .command('policy list', 'List all policies')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .option('--format <format>', 'output format: text, json', ['text', 'json'], 'text')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        policyService.listAll(config, logger);
      });

    (caporal as any)
      .command('policy get', 'Get a policy by ID')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .option('--format <format>', 'output format: text, json', ['text', 'json'], 'text')
      .argument('<id>', 'Policy ID')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        policyService.getById(args.id, config, logger);
      });

    (caporal as any)
      .command('policy create', 'Create a new policy from a local JSON file')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .argument('<file>', 'JSON policy file location')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        policyService.create(args.file, config, logger);
      });

    (caporal as any)
      .command('policy update', 'Update a policy from a local JSON file')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .argument('<id>', 'Policy ID')
      .argument('<file>', 'JSON policy file location')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        policyService.update(args.id, args.file, config, logger);
      });

    (caporal as any)
      .command('policy delete', 'Delete a policy by ID')
      .option('--username <username>', 'Metricly Username')
      .option('--password <password>', 'Metricly Password')
      .option('--profile <profile>', 'Metricly profile', /.*/, 'default')
      .argument('<id>', 'Policy ID')
      .action((args, options, logger) => {
        const config = configService.mergeConfig(options);
        policyService.deleteById(args.id, config, logger);
      });
  }
}

export default PolicyCommands;
