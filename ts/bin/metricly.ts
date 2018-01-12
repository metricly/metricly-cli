#! /usr/bin/env node

import * as caporal from 'caporal';
import * as fs from 'fs';
import * as inquirer from 'inquirer';

import DashboardCommands from '../commands/DashboardCommands';
import PackageCommands from '../commands/PackageCommands';
import PolicyCommands from '../commands/PolicyCommands';
import CommandUtils from '../util/CommandUtils';

// tslint:disable-next-line:no-var-requires
const pkg = require('../../package.json');

(caporal as any)
  .version(pkg.version)
  .description(pkg.description);

(caporal as any)
  .command('config', 'Set local defaults')
  .action((args, options, logger) => {
    const config = CommandUtils.mergeConfig({});
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

PackageCommands.addCommands();

PolicyCommands.addCommands();

DashboardCommands.addCommands();

(caporal as any).parse(process.argv);
