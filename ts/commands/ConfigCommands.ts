import * as caporal from 'caporal';
import * as fs from 'fs';
import * as inquirer from 'inquirer';

import ConfigService from '../services/ConfigService';
import EncryptionUtil from '../util/EncryptionUtil';

const configService = new ConfigService();

class ConfigCommands {

  public static addCommands() {
    (caporal as any)
      .command('config', 'Set local defaults')
      .option('--profile', 'Metricly profile', /.*/, 'default')
      .action((args, options, logger) => {
        const profileConfig = configService.getConfig()[options.profile] || {};
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
          const config = configService.getConfig();
          answers.password = EncryptionUtil.encrypt(answers.password);
          config[options.profile] = answers;
          configService.saveConfig(config);
        });
      });
  }

}

export default ConfigCommands;
