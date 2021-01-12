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
        json: true,
        method: 'POST',
        uri: config.endpoint + '/capacity/analyze/AWS',
        body: {
          analysisType: 'RIGHT_SIZING',
          endDate: moment().day(-1).format('YYYY-MM-DD'),
          rollup: 'P7D',
          startDate: moment().day(-7).format('YYYY-MM-DD'),
          elementFilter: {
            attributesExclude: [],
            attributesInclude: [],
            attributesMatchType: 'ANY',
            idsExclude: [],
            idsInclude: [],
            nameRegexInclude: '',
            nameRegexExclude: '',
            tagsInclude: [],
            tagsMatchType: 'ANY',
            tagsExclude: [],
          },
          topNLimit: 0,
          groupKey: '',
          savingsPeriod: 'month',
          perfStatistic: 'p95',
          constraints: [
            {
              defaultValue: 60,
              fixedFloor: 0,
              rule: 'dynamic',
              type: 'memory',
              maxUtil: 95
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
          ]
        }
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
