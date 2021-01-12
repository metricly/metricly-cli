import * as caporal from 'caporal';
import * as moment from 'moment';
import * as request from 'request-promise';

class NewReportsService {

  public async ec2rightsizing(config, logger): Promise<void> {
    logger.debug('\nQuerying the latest EC2 Right Sizing report');
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        body: {
          analysisType: 'RIGHT_SIZING',
          constraints: [
            {
              defaultValue: 60,
              fixedFloor: 0,
              maxUtil: 95,
              rule: 'dynamic',
              type: 'memory'
            },
            {
              fixedFloor: 0,
              maxUtil: 95,
              type: 'cpu'
            },
            {
              fixedFloor: 0,
              requirePremiumIO: false,
              rule: 'none',
              type: 'diskio'
            }
          ],
          elementFilter: {
            attributesExclude: [],
            attributesInclude: [],
            attributesMatchType: 'ANY',
            idsExclude: [],
            idsInclude: [],
            nameRegexExclude: '',
            nameRegexInclude: '',
            tagsExclude: [],
            tagsInclude: [],
            tagsMatchType: 'ANY',
          },
          endDate: moment().day(-1).format('YYYY-MM-DD'),
          groupKey: '',
          perfStatistic: 'p95',
          rollup: 'P7D',
          savingsPeriod: 'month',
          startDate: moment().day(-7).format('YYYY-MM-DD'),
          topNLimit: 0
        },
        json: true,
        method: 'POST',
        uri: config.endpoint + '/capacity/analyze/AWS'
      });
      if (config.format === 'json' || 'text') {
        logger.info(JSON.stringify(response, null, 2));
      }
    } catch (e) {
      logger.error('There was an error listing the report: ' + e);
    }
  }

}

export default NewReportsService;
