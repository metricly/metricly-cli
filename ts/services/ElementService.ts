import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as moment from 'moment';
import * as request from 'request-promise';
import * as Table from 'tty-table';

const MAINT_TAG_NAME = 'n.state.maintenance';
const MAINT_END_TAG_NAME = 'n.state.maintenance_end';
const MS_IN_HOUR = 3600000;

class ElementService {

  public async lsMaintenanceMode(config, logger): Promise<void> {
    logger.info('\nListing elements in maintenance mode');
    try {
      const requestBody = this.buildBaseElementQuery(config);
      const elementTags = 'elementTags';
      requestBody.body[elementTags] = this.buildKeyValueQueryTerm(MAINT_TAG_NAME, 'true');

      logger.debug(JSON.stringify(requestBody, null, 2));

      const response = await request(requestBody);
      if (config.format === 'text') {
        logger.info(response.page.content.map((el) => {
          const endEpoch = el.netuitiveTags[MAINT_END_TAG_NAME];
          if (typeof endEpoch === 'undefined' || endEpoch < 0) {
            return el.name + ' id(' + el.id + ')' + ' ending(never)';
          } else {
            const endDate = new Date( parseInt(endEpoch, 10) );
            return `${el.name} id(${el.id}) ending(${endDate.toUTCString()})`;
          }
        }));
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }
    } catch (e) {
      logger.error('There was an error listing the elements: ' + e);
    }
  }

  public async startMaintenanceMode(id, config, logger): Promise<void> {
    let endEpoch;
    let endDate;
    if (typeof config.hours === 'undefined') {
      endEpoch = -1;
      logger.info('\nStart maintenance mode on Element ' + id + ' without a specified end time');
    } else {
      endEpoch = new Date().getTime() + (config.hours * MS_IN_HOUR);
      endDate = (new Date( endEpoch )).toUTCString();
      logger.info(`Start maintenance mode on Element ${id}) with duration ${config.hours} hours until ${endDate}`);
    }

    try {
      let response = await this.setTag(config, logger, id, MAINT_TAG_NAME, true);
      if (config.format === 'text') {
        logger.info(response);
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }

      response = await this.setTag(config, logger, id, MAINT_END_TAG_NAME, endEpoch);
      if (config.format === 'text') {
        logger.info(response);
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }
    } catch (e) {
      logger.error('There was an error listing the elements: ' + e);
    }
  }

  public async stopMaintenanceMode(id, config, logger): Promise<void> {
    logger.info('\nStop maintenance mode on Element ' + id);
    try {
      let response = await this.deleteTag(config, logger, id, MAINT_TAG_NAME);
      if (config.format === 'text') {
        logger.info(response);
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }

      response = await this.deleteTag(config, logger, id, MAINT_END_TAG_NAME);
      if (config.format === 'text') {
        logger.info(response);
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response, null, 2));
      }

    } catch (e) {
      logger.error('There was an error listing the elements: ' + e);
    }
  }

  public async deleteTag(config, logger, elementId, tagName) {

    const uriString = `${config.endpoint}/elements/${elementId}/tags/${tagName}`;
    logger.debug('Delete tag with URI: ' + uriString);

    const response = await request({
      auth: {
        pass: config.password,
        user: config.username
      },
      json: true,
      method: 'DELETE',
      uri: uriString
    });
    return response;

  }

  public async setTag(config, logger, elementId, tagName, tagValue) {

    const tagBody = { netuitiveTag: {} };
    tagBody.netuitiveTag[tagName] = tagValue;
    logger.debug('tag: ' + JSON.stringify(tagBody));

    // check if Element current has this tag so we can select the appropriate
    //  endpoint to use (PUT or POST)
    const hasTag = await request({
      auth: {
        pass: config.password,
        user: config.username
      },
      json: true,
      method: 'GET',
      uri: `${config.endpoint}/elements/${elementId}/tags`
    });

    // if the tag is present
    let uri;
    let method;
    if (typeof hasTag.netuitiveTags[tagName] === 'undefined') {
      uri = `${config.endpoint}/elements/${elementId}/tags`;
      method = 'POST';
    } else {
      uri = `${config.endpoint}/elements/${elementId}/tags/${tagName}`;
      method = 'PUT';
    }

    logger.debug(`URI[${uri}] METHOD[${method}]`);

    const response = await request({
      auth: {
        pass: config.password,
        user: config.username
      },
      body: tagBody,
      json: true,
      method,
      uri
    });
    return response;
  }

  public async elementSearch(config, logger): Promise<void> {

    // base query
    const requestBody = this.buildBaseElementQuery(config);

    // add name term
    if (config.name) {
      const field = 'elementNames';
      requestBody.body[field] = this.buildValueQueryTerm(config.name, true, false);
    }
    // add type term
    if (config.type) {
      const field = 'elementTypes';
      requestBody.body[field] = this.buildValueQueryTerm(config.type, true, true);
    }
    // add attributes term
    if (config.attribute) {
      const attrKey = config.attribute.split('=')[0];
      const attrVal = config.attribute.split('=')[1];

      const field = 'attributes';
      requestBody.body[field] = this.buildKeyValueQueryTerm(attrKey, attrVal);
    }
    // add elementTags term
    if (config.tag) {
      const tagKey = config.tag.split('=')[0];
      const tagVal = config.tag.split('=')[1];

      const field = 'elementTags';
      requestBody.body[field] = this.buildKeyValueQueryTerm(tagKey, tagVal);
    }
    // add collectors term
    if (config.collector) {
      const field = 'collectorNames';
      requestBody.body[field] = this.buildValueQueryTerm(config.collector, true, true);
    }

    logger.debug(JSON.stringify(requestBody, null, 2));

    try {
      const response = await request(requestBody);
      if (config.format === 'text') {

        const header = [{value: 'name'}, {value: 'type'}, {value: 'id'}, {value: 'fqn'}];

        const rows = [];
        response.page.content.forEach((el) => {
          rows.push([el.name, el.type, el.id, el.fqn]);
        });

        const table = Table(header, rows, {
          align : 'left',
          borderStyle : 1,
          color : 'white',
          headerAlign : 'left'
        });

        logger.info(table.render());
        let summary = `Page Size [${response.page.size}] - `;
        summary += `Page Number [${response.page.number} of ${response.page.totalPages - 1}] - `;
        summary += `Total Elements [${response.page.totalElements}]`;
        logger.info(`\t\t${summary}\n`);
      }
      if (config.format === 'json') {
        logger.info(JSON.stringify(response.page.content, null, 2));
      }
    } catch (e) {
      logger.error('There was an error listing the elements: ' + e);
    }
  }

  public buildBaseElementQuery(config) {
    const queryPage = config.page || 0;
    const queryPageSize = config.pageSize || 35;

    return {
      auth: {
        pass: config.password,
        user: config.username
      },
      body: {
        endDate: moment().format(),
        page: queryPage,
        pageSize: queryPageSize,
        sort: {
          field: 'name',
          missing: '_last',
          order: 'asc'
        },
        sourceFilter: {
          excludes: ['metrics']
        },
        startDate: moment().subtract(1, 'd').format()
      },
      json: true,
      method: 'POST',
      uri: `${config.endpoint}/elements/elasticsearch/elementQuery`
    };
  }

  public buildValueQueryTerm(value: string, queryContains = true, queryLiteral = false) {
    return {
      and: false,
      items: [{
        contains: queryContains,
        item: value,
        literal: queryLiteral
      }]
    };
  }

  public buildKeyValueQueryTerm(queryKey: string, queryVal: string) {
    return {
      and: true,
      items: [{
        contains: true,
        key: queryKey,
        literal: true,
        value: queryVal
      }]
    };
  }

}

export default ElementService;
