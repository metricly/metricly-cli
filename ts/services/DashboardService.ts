import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as request from 'request-promise';

class DashboardService {

  public async list(config, logger): Promise<void> {
    logger.debug('\nListing dashboards');
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        uri: config.endpoint + '/dashboards'
      });
      if (config.options.format === 'text') {
        logger.info('The following dashboards are available:');
        logger.info(response.dashboards.sort((dsb1, dsb2) => {
          return dsb1.name.localeCompare(dsb2.name);
        }).map((dsb) => {
          return dsb.name + ' (ID: ' + dsb.id + ')';
        }));
      }
      if (config.options.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }
    } catch (e) {
      logger.error('There was an error listing the dashboards: ' + e);
    }
  }

  public async getById(id: string, config, logger): Promise<void> {
    logger.debug('\nGetting dashboard ' + id);
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        uri: config.endpoint + '/dashboards/' + id
      });
      if (config.options.format === 'text') {
        logger.info(response.dashboard.name);
      }
      if (config.options.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }
    } catch (e) {
      logger.error('There was an error getting the dashboard: ' + e);
    }
  }
}

export default DashboardService;
