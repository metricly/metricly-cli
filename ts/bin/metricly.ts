#! /usr/bin/env node

import * as caporal from 'caporal';
import * as updateNotifier from 'update-notifier';

import ConfigCommands from '../commands/ConfigCommands';
import DashboardCommands from '../commands/DashboardCommands';
import PackageCommands from '../commands/PackageCommands';
import PolicyCommands from '../commands/PolicyCommands';

// tslint:disable-next-line:no-var-requires
const pkg = require('../../package.json');

updateNotifier({ pkg }).notify();

(caporal as any)
  .version(pkg.version)
  .description(pkg.description);

ConfigCommands.addCommands();
PackageCommands.addCommands();
PolicyCommands.addCommands();
DashboardCommands.addCommands();

(caporal as any).parse(process.argv);
