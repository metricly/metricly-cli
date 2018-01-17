#! /usr/bin/env node

import * as caporal from 'caporal';
import chalk from 'chalk';
import * as updateNotifier from 'update-notifier';

import ConfigCommands from '../commands/ConfigCommands';
import DashboardCommands from '../commands/DashboardCommands';
import PackageCommands from '../commands/PackageCommands';
import PolicyCommands from '../commands/PolicyCommands';

// tslint:disable-next-line:no-var-requires
const pkg = require('../../package.json');

const notifier = updateNotifier({ pkg });

notifier.notify({
  defer: false,
  message: [
    'Update available ' + chalk.dim(notifier.update.current) + chalk.reset(' → ') + chalk.green(notifier.update.latest),
    'Run ' + chalk.cyan('npm i -g metricly-cli') + ' or download the latest binary to upgrade',
    chalk.blue('https://github.com/metricly/metricly-cli/releases/latest')
  ].join('\n')
});

(caporal as any)
  .version(pkg.version)
  .description(pkg.description);

ConfigCommands.addCommands();
PackageCommands.addCommands();
PolicyCommands.addCommands();
DashboardCommands.addCommands();

(caporal as any).parse(process.argv);
