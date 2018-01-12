import * as caporal from 'caporal';
import * as request from 'request-promise';

// tslint:disable-next-line:no-var-requires
const pkg = require('../../package.json');

class VersionCommands {

  public static addCommands() {
    (caporal as any)
      .command('check version', 'Check if there is a newer version of the Metricly CLI')
      .action(async (args, options, logger) => {
        const release = await request({
          headers: {
            'User-Agent': 'Metricly-CLI'
          },
          json: true,
          uri: 'https://api.github.com/repos/metricly/metricly-cli/releases/latest'
        });
        if (`v${pkg.version}` !== release.tag_name) {
          // tslint:disable-next-line:max-line-length
          logger.info('There is a updated version available. Install with *npm i -g metricly-cli* or download a binary from https://github.com/metricly/metricly-cli/releases/latest');
        } else {
          logger.info('You have the latest version.');
        }
        logger.info(`\nCurrent version: v${pkg.version}`);
        logger.info(`Latest version:  ${release.tag_name}`);
      });
  }
}

export default VersionCommands;
