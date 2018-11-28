import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as moment from 'moment';
import * as request from 'request-promise';
import { Report } from '../model/Report';
import { ReportContent } from '../model/report/ReportContent';
import { ReportViewScope } from '../model/report/ReportViewScope';

class ReportService {

  public async list(config, logger): Promise<void> {
    logger.debug('\nListing reports');
    try {
      const reports = await this.getReports(config, logger);

      if (config.format === 'text') {
        logger.info('The following reports are available:');
        logger.info(reports.sort((rpt1, rpt2) => {
          return rpt1.name.localeCompare(rpt2.name);
        }).map((report) => {
          return `${report.name} (Type: ${report.type}, ID: ${report.id})`;
        }));
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(reports, null, 2));
      }
    } catch (e) {
      logger.error('There was an error listing the reports: ' + e);
    }
  }

  public async ec2cost(config, logger): Promise<void> {
    logger.debug('\nListing EC2CostData');
    try {
      const reports = await this.getReports(config, logger);
      // DailyAwsCost is where the viewDefinition 'groupedCost'
      // lives, this viewDef has cost details for single service
      // grouped and aggregated
      const dailyAwsCostReport = reports.filter( (report) => report.type === 'DailyAwsCost' );
      if (dailyAwsCostReport) {
        const report = Array.isArray(dailyAwsCostReport) ? dailyAwsCostReport[0] : dailyAwsCostReport;
        if (report) {
          const elementsInScope = await this.getElementsInScope(config, logger, report);
          if (elementsInScope.content) {
            const elementFilter = elementsInScope.content.map( (x) => x.element_id );
            const groupedCost = await this.getGroupedCost(config, logger, report, elementFilter);
            if (config.format === 'text') {
              logger.info(groupedCost.content.sort((rpt1, rpt2) => {
                return rpt1.display_category.localeCompare(rpt2.display_category);
              }).map((rpt) => {
                return `${rpt.display_category} (Cost: ${rpt.total_cost})`;
              }));
            }

            // json
            if (config.format === 'json') {
              logger.info(JSON.stringify(groupedCost, null, 2));
            }
          }
        }
      }
    } catch (e) {
      logger.error('There was an error getting EC2 cost data: ' + e);
    }
  }

  private async getReports(config, logger): Promise<Report[]> {
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        uri: config.endpoint + '/reports'
      });
      return response.reports;
    } catch (e) {
      logger.error('There was an error getting the reports: ' + e);
      return [];
    }
  }

  private async getElementsInScope(config, logger, report: Report): Promise<ReportContent> {

    const reportScope = new ReportViewScope('elementsInScope', {
      elementTypes: ['EC2', 'WINSVR', 'SERVER'],
      endDate: this.getEndDate(report.endDate, config.period),
      startDate: this.getStartDate(report.endDate, config.period)
    },
    config.rowlimit);
    return this.doReportContentPost(config, logger, reportScope, report);
  }

  private async getGroupedCost(config, logger, report: Report, elementIds: string[]): Promise<ReportContent> {

    const reportScope = new ReportViewScope('groupedCost', {
      activeQuantityAgg: 'sum',
      categoriseBy: 'category',
      elementFilter: elementIds,
      endDate: this.getEndDate(report.endDate, config.period),
      groupBy: config.groupby,
      groupKey: 'attribute=' + config.groupbykey,
      instanceTypeKey: 'instanceType', // for RDS this is dbInstanceClass
      service: 'EC2',
      startDate: this.getStartDate(report.endDate, config.period)
    },
    config.rowlimit);
    return this.doReportContentPost(config, logger, reportScope, report);
  }

  private async doReportContentPost(config, logger, bodyObject, report) {
    try {
      const response = await request.post({
        auth: {
          pass: config.password,
          user: config.username
        },
        body: bodyObject,
        json: true,
        uri: config.endpoint + '/reports/content/' + report.id
      });
      return response;
    } catch (e) {
      logger.error('There was an error fetching the report content: ' + e);
    }
  }

  private getStartDate(endDate: Date, period: string) {

    return period === 'lastMonth' ?
                          moment(endDate).utc().subtract(1, 'months').startOf('month').toISOString() :
           period === 'monthToDate' ?
                          moment(endDate).utc().startOf('month').toISOString() :
                          moment(endDate).utc().startOf('day').toISOString();

  }

  private getEndDate(endDate: Date, period: string) {

    return period === 'lastMonth' ?
                          moment(endDate).utc().subtract(1, 'months').endOf('month').toISOString() :
                          moment(endDate).toISOString();
  }

}

export default ReportService;
