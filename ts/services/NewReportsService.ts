import * as moment from 'moment';
import * as caporal from 'caporal';
import * as request from 'request-promise';

class NewReportsService {

  public async ec2rightsizing(config, logger): Promise<void> {
    logger.debug('\nListing the latest EC2 Right Sizing report');
    try {
      const response = await request({
        method: 'POST',
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        uri: config.endpoint + '/capacity/analyze/AWS',
        body: {
          "analysisType": "RIGHT_SIZING",
          "rollup": "P7D",
          "startDate": moment().day(-7).format('YYYY-MM-DD'),
          "endDate": moment().day(-1).format('YYYY-MM-DD'),
          "elementFilter": {
            "idsInclude": [],
            "idsExclude": [],
            "tagsInclude": [],
            "tagsMatchType": "ANY",
            "tagsExclude": [],
            "attributesInclude": [],
            "attributesMatchType": "ANY",
            "attributesExclude": [],
            "nameRegexInclude": "",
            "nameRegexExclude": ""
          },
          "topNLimit": 0,
          "groupKey": "",
          "savingsPeriod": "month",
          "perfStatistic": "p95",
          "constraints": [
            {
              "type": "memory",
              "rule": "dynamic",
              "defaultValue": 60,
              "fixedFloor": 0,
              "maxUtil": 95
            },
            {
              "type": "cpu",
              "rule": "dynamic",
              "fixedFloor": 0,
              "maxUtil": 95
            },
            {
              "type": "diskio",
              "rule": "none",
              "fixedFloor": 0,
              "requirePremiumIO": false
            }
          ]
        }
      });
      //if (config.format === 'text' ) {
        //logger.info('Your latest EC2 Right Sizing report:');
      //}
      if (config.format === 'json' || 'text') {
        logger.info(JSON.stringify(response, null, 2));
      }
    } catch (e) {
      logger.error('There was an error listing the report: ' + e);
    }
  }

}

export default NewReportsService;
