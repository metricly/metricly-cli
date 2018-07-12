import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as request from 'request-promise';

const MAINT_TAG_NAME = 'n.state.maintenance';
const MAINT_END_TAG_NAME = 'n.state.maintenance_end';
const MS_IN_HOUR = 3600000;

class ElementService {

  public async lsMaintenanceMode(config, logger): Promise<void> {
    logger.info('\nListing elements in maintenance mode');
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        body: {
          elementTags: {
            and: true,
            items: [{
              contains: true,
              key: MAINT_TAG_NAME,
              literal: true,
              value: 'true'
            }]
          },
          page: 0,
          pageSize: 50,
          sort: {
            field: 'name',
            missing: '_last',
            order: 'asc'
          },
          sourceFilter: {
            excludes: ['metrics']
          }
        },
        json: true,
        method: 'POST',
        uri: `${config.endpoint}/elements/elasticsearch/elementQuery`
      });
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

}

export default ElementService;
