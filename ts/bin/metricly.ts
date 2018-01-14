#! /usr/bin/env node

import * as caporal from 'caporal';

import ConfigCommands from '../commands/ConfigCommands';
import DashboardCommands from '../commands/DashboardCommands';
import PackageCommands from '../commands/PackageCommands';
import PolicyCommands from '../commands/PolicyCommands';
import VersionCommands from '../commands/VersionCommands';

// tslint:disable-next-line:no-var-requires
const pkg = require('../../package.json');

(caporal as any)
  .version(pkg.version)
  .description(pkg.description);

PackageCommands.addCommands();
PolicyCommands.addCommands();
DashboardCommands.addCommands();
VersionCommands.addCommands();

(caporal as any).parse(process.argv);
