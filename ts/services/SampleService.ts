import * as moment from 'moment';
import * as request from 'request-promise';
import * as Table from 'tty-table';

import {ElasticSearchQuery, ElasticSearchQueryList, ElasticSearchQueryMap, ElasticSearchSortField, ElasticSearchSourceFilter, Page} from '../model/ElasticSearchQuery';
import ElementService from './ElementService';
const elementService = new ElementService();

class SampleService {
    public async getSamples(elementId, metricId, config, logger): Promise<void> {
        try {
            const queryUri = this.buildSampleUri(elementId, metricId, config, logger);
            logger.debug(`Running Query: ${queryUri}`);

            const response = await request({
                auth: {
                    pass: config.password,
                    user: config.username
                },
                json: true,
                method: 'GET',
                uri: `${queryUri}`
            });

            if (config.format === 'table') {
                const header = [{value: 'timestamp'}, {value: 'rollup'},
                    {value: 'cnt'}, {value: 'min'}, {value: 'avg'}, {value: 'max'}, {value: 'sum'}];

                const rows = [];
                response.samples.forEach((s) => {
                  rows.push([s.timestamp, s.rollup, s.data.cnt, s.data.min, s.data.avg, s.data.max, s.data.sum]);
                });

                const table = Table(header, rows, {
                  align : 'left',
                  borderStyle : 1,
                  color : 'white',
                  headerAlign : 'left'
                });

                logger.info(table.render());
            }
            if (config.format === 'csv') {
                logger.info('timestamp, rollup, cnt, min, avg, max, sum, val');
                const rows = [];
                response.samples.forEach((s) => {
                    let line = `${s.timestamp}, ${s.rollup}, `;
                    line += `${s.data.cnt}, ${s.data.min}, ${s.data.avg}, ${s.data.max}, ${s.data.sum}, ${s.data.val}`;
                    logger.info(line);
                });
            }

            if (config.format === 'json') {
                logger.info(JSON.stringify(response, null, 2));
            }
        } catch (e) {
            logger.error('There was an error listing the elements: ' + e);
        }
    }

    public buildSampleUri(elementId, metricId, config, logger) {
        let queryUri = `${config.endpoint}`;
        queryUri += `/ui/elements/${elementId}`;
        queryUri += `/metrics/${metricId}`;
        queryUri += `/samples?aggregations=ACTUAL`;
        if (config.rollup) {
            queryUri += `&rollup=${config.rollup}`;
        }
        if (config.duration) {
            queryUri += `&duration=${config.duration}`;
        }
        if (config.startTime) {
            queryUri += `&startTime=${config.startTime}`;
        }
        if (config.endTime) {
            queryUri += `&endTime=${config.endTime}`;
        }

        return queryUri;
    }

    public async summarizeSamples(config, logger): Promise<void> {
        try {
            const queryBody = this.buildElementQuery(config, logger);
            queryBody.sort = new ElasticSearchSortField('name', 'asc', '_last');

            if (!config.startTime) {
                config.startTime = moment().startOf('month').format();
            }

            if (!config.endTime) {
                config.endTime = moment().format();
            }

            const metricRequest = this.buildRequest(config, queryBody, 'metrics/elasticsearch/metricQuery');
            const metricResponse = await request(metricRequest);
            logger.debug('METRIC REQUEST: ' + JSON.stringify(metricRequest, null, 2));
            logger.debug('METRIC RESPONSE: ' + JSON.stringify(metricResponse, null, 2));

            const rows = [];

            for (const el of metricResponse.page.content) {
                const elementId = el.elementId;
                const metricId = el.id;
                const metricFqn = el.fqn;

                // get Element name
                const elementQuery = new ElasticSearchQuery();
                elementQuery.elementIds = ElasticSearchQueryList.withItem(elementId);
                elementQuery.sourceFilter = new ElasticSearchSourceFilter([ 'id', 'name', 'type']);
                const elementResponse = await request({
                    auth: {
                        pass: config.password,
                        user: config.username
                    },
                    body: elementQuery,
                    json: true,
                    method: 'POST',
                    uri: `${config.endpoint}/elements/elasticsearch/elementQuery`
                });
                const element = {id: elementResponse.page.content[0].id, name: elementResponse.page.content[0].name, type: elementResponse.page.content[0].type};

                logger.debug('ELEMENT REQUEST: ' + JSON.stringify(elementQuery, null, 2));
                logger.debug('ELEMENT RESPONSE: ' + JSON.stringify(elementResponse, null, 2));

                const queryUri = this.buildSampleUri(elementId, metricId, config, logger);
                const resp = await request({
                    auth: {
                        pass: config.password,
                        user: config.username
                    },
                    json: true,
                    method: 'GET',
                    uri: `${queryUri}`
                });

                logger.debug('SAMPLE REQUEST: ' + queryUri);
                logger.trace(JSON.stringify(resp, null, 2));

                rows.push([elementId, element.name, element.type, config.startTime, config.endTime, metricFqn, metricId, resp.sampleMin, resp.sampleAvg, resp.sampleMax, resp.sampleSum]);
            }

            if (config.format === 'csv') {
                logger.info('elementId, elementName, elementType, start, end, metricFqn, metricId, min, avg, max, sum');
                rows.forEach((r) => logger.info(`${r[0]},${r[1]},${r[2]},${r[3]},${r[4]},${r[5]},${r[6]},${r[7]},${r[8]},${r[9]},${r[10]}`));
            }

            if (config.format === 'table') {
                const header = [
                    {value: 'elementId'}, {value: 'elementName'}, {value: 'elementType'},
                    {value: 'start'}, {value: 'end'}, {value: 'metricFqn'}, {value: 'metricId'},
                    {value: 'min'}, {value: 'avg'}, {value: 'max'}, {value: 'sum'}
                ];
                const table = Table(header, rows, {
                    align : 'left',
                    borderStyle : 1,
                    color : 'white',
                    headerAlign : 'left'
                });
                logger.info(table.render());
            }
        } catch (e) {
            logger.error('There was an error listing the elements: ' + e);
        }
    }

    public buildRequest(config, queryBody, uri) {
        const queryPage = config.page || 0;
        const queryPageSize = config.pageSize || 35;

        return {
            auth: {
                pass: config.password,
                user: config.username
            },
            body: queryBody,
            json: true,
            method: 'POST',
            uri: `${config.endpoint}/${uri}`
        };
    }

    public buildElementQuery(config, logger) {
        const query = new ElasticSearchQuery();

        if (config.name) {
            query.elementNames = ElasticSearchQueryList.withItems(config.name.split(','));
        }
        if (config.type) {
            query.elementTypes = ElasticSearchQueryList.withItems(config.type.split(','));
        }
        // if (config.attribute) {
        //     const attr = config.attribute.split('=');
        //     query.elementAttributes = ElasticSearchQueryMap.withItems([{key: attr[0], value: attr[1]}], 'key', 'value');
        // }
        if (config.tag) {
            const tag = config.tag.split('=');
            query.elementTags = ElasticSearchQueryMap.withItems([{key: tag[0], value: tag[1]}], 'key', 'value');
        }
        if (config.collector) {
            query.collectorNames = ElasticSearchQueryList.withItem(config.collector);
        }
        if (config.metricFqn) {
            query.metricFqns = ElasticSearchQueryList.withItems(config.metricFqn.split(','));
        }
        return query;
    }

}

export default SampleService;
