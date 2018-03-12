import * as fs from 'fs';
import * as request from 'request-promise';

class PolicyService {

  public async listAll(config, logger): Promise<void> {
    logger.debug('\nListing all policies');
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        uri: config.endpoint + '/policies'
      });
      if (config.format === 'text') {
        logger.info('The following policies are installed:');
        logger.info(response.policies.sort((pol1, pol2) => {
          return pol1.name.localeCompare(pol2.name);
        }).map((pol) => {
          return pol.name + ' (ID: ' + pol.id + ')';
        }));
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }
    } catch (e) {
      logger.error('There was an error listing the policies: ' + e);
    }
  }

  public async getById(id: string, config, logger): Promise<void> {
    logger.debug('\nGetting policy ' + id);
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        uri: config.endpoint + '/policies/' + id
      });
      if (config.format === 'text') {
        logger.info(response.policy.name);
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }
    } catch (e) {
      logger.error('There was an error getting the policy: ' + e);
    }
  }
}

export default PolicyService;
