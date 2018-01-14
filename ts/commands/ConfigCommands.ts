import * as caporal from 'caporal';
import * as fs from 'fs';
import * as inquirer from 'inquirer';

import CommandUtils from '../util/CommandUtils';

class ConfigCommands {

  public static addCommands() {
    (caporal as any)
      .command('config', 'Set local defaults')
      .action((args, options, logger) => {
        const config = CommandUtils.mergeConfig(options);
        inquirer.prompt([{
          default: config.username,
          message: 'Metricly Username',
          name: 'username',
          type: 'input'
        }, {
          default: config.password,
          message: 'Metricly Password',
          name: 'password',
          type: 'password'
        }, {
          default: config.endpoint || 'https://app.netuitive.com',
          message: 'Metricly Endpoint',
          name: 'endpoint',
          type: 'input'
        }]).then((answers) => {
          const location = process.env.HOME + '/.metricly-cli.json';
          fs.writeFileSync(location, JSON.stringify(answers, null, 2));
        });
      });
  }
}

export default ConfigCommands;
