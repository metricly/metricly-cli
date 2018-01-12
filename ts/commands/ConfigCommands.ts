import * as caporal from 'caporal';
import * as fs from 'fs';
import * as inquirer from 'inquirer';

import CommandUtils from '../util/CommandUtils';

class ConfigCommands {

  public static addCommands() {
    (caporal as any)
      .command('config', 'Set local defaults')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .action((args, options, logger) => {
        const profileConfig = CommandUtils.getConfig()[options.profile] || {};
        inquirer.prompt([{
          default: profileConfig.username,
          message: 'Metricly Username',
          name: 'username',
          type: 'input'
        }, {
          default: profileConfig.password,
          message: 'Metricly Password',
          name: 'password',
          type: 'password'
        }, {
          default: profileConfig.endpoint || 'https://app.netuitive.com',
          message: 'Metricly Endpoint',
          name: 'endpoint',
          type: 'input'
        }]).then((answers) => {
          const config = CommandUtils.getConfig();
          config[options.profile] = answers;
          CommandUtils.saveConfig(config);
        });
      });
  }
}

export default ConfigCommands;
