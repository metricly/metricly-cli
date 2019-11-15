import * as moment from 'moment';
import * as request from 'request-promise';
import * as Table from 'tty-table';

const MAINT_TAG_NAME = 'n.state.maintenance';
const MAINT_END_TAG_NAME = 'n.state.maintenance_end';
const MS_IN_HOUR = 3600000;

export type Tuple = [string, string];

class ElementService {

  public async lsMaintenanceMode(config, logger): Promise<void> {
    logger.info('\nListing elements in maintenance mode');
    try {
      const requestBody = this.buildBaseElementQuery(config);
      const elementTags = 'elementTags';
      requestBody.body[elementTags] = this.buildKeyValueQueryTerm([[MAINT_TAG_NAME, 'true']]);

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

    try {
    // base query
    const requestBody = this.buildBaseElementQuery(config);
      // find elements
    const response = await this.findElements(requestBody, config.name, config.type,
        config.attribute, config.tag, config.collector);

    const rows = [];
    response.page.content.forEach((el) => {
      rows.push([el.name, el.type, el.id, el.fqn]);
    });

    // CSV
    if (config.format === 'csv') {
      logger.info('name, type, id, fqn');
      rows.forEach((r) => logger.info(`${r[0]},${r[1]},${r[2]},${r[3]}`));
    }
    // TTY TABLE
    if (config.format === 'table') {

      const header = [{value: 'name'}, {value: 'type'}, {value: 'id'}, {value: 'fqn'}];
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
    // Formated JSON
    if (config.format === 'json') {
        logger.info(JSON.stringify(response.page.content, null, 2));
      }
    } catch (e) {
      logger.error('There was an error listing the elements: ' + e);
    }
  }

  public async findElements(requestBody, name, type, attribute, tag, collector) {

    // add name term
    if (name) {
      const field = 'elementNames';
      requestBody.body[field] = this.buildValueQueryTerm(name, true, false);
    }
    // add type term
    if (type) {
      const field = 'elementTypes';
      requestBody.body[field] = this.buildValueQueryTerm(type, true, true);
    }
    // add attributes term
    if (attribute) {
      const field = 'attributes';
      requestBody.body[field] = this.buildKeyValueQueryTerm(attribute.split(',').map((pair) => {
        return pair.split('=');
      }));
    }
    // add elementTags term
    if (tag) {
      const field = 'elementTags';
      requestBody.body[field] = this.buildKeyValueQueryTerm(tag.split(',').map((pair) => {
        return pair.split('=');
      }));
    }
    // add collectors term
    if (collector) {
      const field = 'collectorNames';
      requestBody.body[field] = this.buildValueQueryTerm(collector, true, true);
    }

    return await request(requestBody);
  }

  public buildBaseElementQuery(config, includeMetrics = false) {
    const queryPage = config.page || 0;
    const queryPageSize = config.pageSize || 35;

    const baseQuery = {
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

    if (includeMetrics) {
      baseQuery.body.sourceFilter.excludes = [];
    }

    return baseQuery;
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

  public buildKeyValueQueryTerm(keyValuePairs: Tuple[]) {
    return {
      and: true,
      items: keyValuePairs.map((tuple) => {
        return {
          contains: true,
          key: tuple[0],
          literal: true,
          value: tuple[1]
        };
      })
    };
  }
}

export default ElementService;
