import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as request from 'request-promise';
import { Report } from '../model/Report';
import { ReportContent } from '../model/report/ReportContent';
import { ReportScope } from '../model/report/ReportScope';

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
          return report.name + ' (Type: ' + report.type + ', ID: ' + report.id + ')';
        }));
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(reports, null, 2));
      }
    } catch (e) {
      logger.error('There was an error listing the reports: ' + e);
    }
  }

  public async getEC2CostData(config, logger): Promise<void> {
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
            const elementFilter = elementsInScope.content.map( (x) => x.element_id);
            const groupedCost = await this.getGroupedCost(config, logger, report, elementFilter);
            if (config.format === 'text') {
              // log cost for now
              logger.info(groupedCost.content.sort((rpt1, rpt2) => {
                return rpt1.display_category.localeCompare(rpt2.display_category);
              }).map((rpt) => {
                return rpt.display_category + ' (Cost: ' + rpt.total_cost + ')';
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
      logger.error('There was an error getting ec2 cost data: ' + e);
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

    const reportScope = new ReportScope('elementsInScope', {
      elementTypes: ['EC2', 'WINSVR', 'SERVER'],
      endDate: report.endDate,
      startDate: this.getStartDate(report.endDate)
    });
    return this.doReportContentPost(config, logger, reportScope, report);

  }

  private async getGroupedCost(config, logger, report: Report, elementIds: string[]): Promise<ReportContent> {

    const reportScope = new ReportScope('groupedCost', {
      activeQuantityAgg: 'sum',
      categoriseBy: 'category',
      elementFilter: elementIds,
      endDate: report.endDate,
      groupBy: 'elementName',
      groupKey: 'attribute=instanceType',
      instanceTypeKey: 'instanceType',
      service: 'EC2',
      startDate: this.getStartDate(report.endDate)
    });
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

  private getStartDate(endDate: Date) {
    const startDate = new Date(endDate);
    startDate.setHours(0, 0, 0, 0); // set to midnight
    return startDate.getUTCDate;
  }

}

export default ReportService;
