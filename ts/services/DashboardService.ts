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
      if (config.format === 'text') {
        logger.info('The following dashboards are available:');
        logger.info(response.dashboards.sort((dsb1, dsb2) => {
          return dsb1.name.localeCompare(dsb2.name);
        }).map((dsb) => {
          return dsb.name + ' (ID: ' + dsb.id + ')';
        }));
      }
      if (config.format === 'json') {
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
      if (config.format === 'text') {
        logger.info(response.dashboard.name);
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }
    } catch (e) {
      logger.error('There was an error getting the dashboard: ' + e);
    }
  }

  public async create(file: string, config, logger): Promise<void> {
    logger.debug('\nCreating dashboard');
    try {
      const dashboard = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        body: dashboard,
        json: true,
        method: 'POST',
        uri: config.endpoint + '/dashboards'
      });
    } catch (e) {
      logger.error('There was an error creating the dashboard: ' + e);
    }
  }

  public async update(id: string, file: string, config, logger): Promise<void> {
    logger.debug('\nUpdating dashboard ' + id);
    try {
      const dashboard = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        body: dashboard,
        json: true,
        method: 'PUT',
        uri: config.endpoint + '/dashboards/' + id
      });
    } catch (e) {
      logger.error('There was an error updating the dashboard: ' + e);
    }
  }

  public async deleteById(id: string, config, logger): Promise<void> {
    logger.debug('\nDeleting dashboard ' + id);
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        method: 'DELETE',
        uri: config.endpoint + '/dashboards/' + id
      });
    } catch (e) {
      logger.error('There was an error deleting the dashboard: ' + e);
    }
  }
}

export default DashboardService;
