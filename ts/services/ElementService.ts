import * as Bluebird from 'bluebird';
import * as fs from 'fs';
import * as request from 'request-promise';

const MAINT_TAG_NAME = 'n.state.maintenance';
const MAINT_END_TAG_NAME = 'n.state.maintenance_end';
const MS_IN_HOUR = 3600000;

class ElementService {

  // LIST ELEMENTS IN MAINT MODE
  public async lsMaintenceMode(config, logger): Promise<void> {
    logger.info('\nListing elements in maintenance mode');
    try {
      const response = await request({
        auth: {
          pass: config.password,
          user: config.username
        },
        json: true,
        method: 'POST',
        body: {
          "sort": {
            "field": "name",
            "order": "asc",
            "missing": "_last"
          },
          "page": 0,
          "pageSize": 50,
          "elementTags": {
            "and": true,
            "items": [{
              "key": MAINT_TAG_NAME,
              "value": "true",
              "literal": true,
              "contains": true
            }]
          },
          "sourceFilter": {
            "excludes": ["metrics"]
          }
        },
        uri: `${config.endpoint}/elements/elasticsearch/elementQuery`
      });
      if (config.format === 'text') {
        logger.info(response.page.content.map((el) => {
          // let tags = [];
          // Object.keys(el.netuitiveTags).forEach(key => tags.push(key + "=" + el.netuitiveTags[key]));
          let endEpoch = el.netuitiveTags[MAINT_END_TAG_NAME]
          if(typeof endEpoch === 'undefined' || endEpoch < 0) {
            return el.name + ' id(' + el.id + ')' + ' ending(never)';
          } else {
            let endDate = new Date( parseInt(endEpoch) );
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

  // STARD MAINT MODE FOR ELEMENT
  public async startMaintenanceMode(id, config, logger): Promise<void> {
    var endEpoch;
    var endDate;
    if(typeof config.hours === 'undefined') {
      endEpoch = -1
      logger.info('\nStart maintenance mode on Element ' + id + ' without a specified end time');
    } else {
      endEpoch = new Date().getTime() + (config.hours * MS_IN_HOUR)
      endDate = new Date( endEpoch );
      logger.info('\nStart maintenance mode on Element ' + id + '; for a duration of ' + config.hours + 'hours; until ' + endDate.toUTCString());
    }

    try {
      var response = await this.setTag(config, logger, id, MAINT_TAG_NAME, true);
      if (config.format === 'text') { logger.info(response); }
      if (config.format === 'json') { logger.info(JSON.stringify(response, null, 2)); }

      response = await this.setTag(config, logger, id, MAINT_END_TAG_NAME, endEpoch);
      if (config.format === 'text') { logger.info(response); }
      if (config.format === 'json') { logger.info(JSON.stringify(response, null, 2)); }
    } catch (e) {
      logger.error('There was an error listing the elements: ' + e);
    }
  }

  // STOP MAINT MODE FOR ELEMENT
  public async stopMaintenanceMode(id, config, logger): Promise<void> {
    logger.info('\nStop maintenance mode on Element ' + id);
    try {
      var response = await this.deleteTag(config, logger, id, MAINT_TAG_NAME);
      if (config.format === 'text') { logger.info(response); }
      if (config.format === 'json') { logger.info(JSON.stringify(response, null, 2)); }

      response = await this.deleteTag(config, logger, id, MAINT_END_TAG_NAME);
      if (config.format === 'text') { logger.info(response); }
      if (config.format === 'json') { logger.info(JSON.stringify(response, null, 2)); }

    } catch (e) {
      logger.error('There was an error listing the elements: ' + e);
    }
  }

  public async deleteTag(config, logger, elementId, tagName){

    let uriString = `${config.endpoint}/elements/${elementId}/tags/${tagName}`;
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

  public async setTag(config, logger, elementId, tagName, tagValue){

    let tagBody = { netuitiveTag: {} };
    tagBody.netuitiveTag[tagName] = tagValue;
    logger.debug("tag: " + JSON.stringify(tagBody));

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
    var uri, method;
    if(typeof hasTag.netuitiveTags[tagName] === 'undefined'){
      uri = `${config.endpoint}/elements/${elementId}/tags`;
      method = 'POST';
    } else {
      uri = `${config.endpoint}/elements/${elementId}/tags/${tagName}`;
      method = 'PUT';
    }

    logger.debug(`URI[${uri}] METHOD[${method}]`)

    const response = await request({
      auth: {
        pass: config.password,
        user: config.username
      },
      json: true,
      method: method,
      body: tagBody,
      uri: uri
    });
    return response;
  }

}

export default ElementService;
