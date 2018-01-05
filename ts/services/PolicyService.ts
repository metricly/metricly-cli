import * as fs from 'fs';
import * as request from 'request-promise';

class PolicyService {

  public async listAll(config, logger): Promise<void> {
    logger.debug('\nListing all policies');
    try {
      const body = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        uri: config.endpoint + '/policies'
      });
      logger.info('The following policies are installed:');
      logger.info(JSON.parse(body).policies.sort((pol1, pol2) => {
        return pol1.name.localeCompare(pol2.name);
      }).map((pol) => {
        return pol.name + ' (ID: ' + pol.id + ')';
      }));
    } catch (e) {
      logger.error('There was an error listing the policies: ' + e);
    }
  }
}

export default PolicyService;
