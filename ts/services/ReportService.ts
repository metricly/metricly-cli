import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as request from 'request-promise';

class ReportService {

  public async list(config, logger): Promise<void> {
    logger.debug('\nListing reports');
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        uri: config.endpoint + '/reports'
      });
      if (config.format === 'text') {
        logger.info('The following reports are available:');
        logger.info(response.reports.sort((rpt1, rpt2) => {
          return rpt1.name.localeCompare(rpt2.name);
        }).map((rpt) => {
          return rpt.name + ' (ID: ' + rpt.id + ')';
        }));
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }
    } catch (e) {
      logger.error('There was an error listing the reports: ' + e);
    }
  }

}

export default ReportService;
