import { ElasticSearchQueryList } from './ElasticSearchQueryList';
import { ElasticSearchQueryMap } from './ElasticSearchQueryMap';
import { ElasticSearchSortField } from './ElasticSearchSortField';
import { ElasticSearchSourceFilter } from './ElasticSearchSourceFilter';

export class ElasticSearchQuery {

    public tenantId: string;
    public metricNames: ElasticSearchQueryList<string>;
    public elementNames: ElasticSearchQueryList<string>;
    public elementFqns: ElasticSearchQueryList<string>;
    public metricFqns: ElasticSearchQueryList<string>;
    public elementIds: ElasticSearchQueryList<string>;
    public metricIds: ElasticSearchQueryList<string>;
    public datasourceIds: ElasticSearchQueryList<number>;
    public collectorNames: ElasticSearchQueryList<string>;
    public elementTypes: ElasticSearchQueryList<string>;
    public metricTypes: ElasticSearchQueryList<string>;
    public metricUnits: ElasticSearchQueryList<string>;
    public metricSparseDataStrategies: ElasticSearchQueryList<string>;
    public elementTags: ElasticSearchQueryMap<string, string>;
    public metricTags: ElasticSearchQueryMap<string, string>;
    public attributes: ElasticSearchQueryMap<string, string>;
    public checkIds: ElasticSearchQueryList<string>;
    public checkNames: ElasticSearchQueryList<string>;
    public sort: ElasticSearchSortField;
    public nestedAggregationFilters: ElasticSearchQueryMap<string, string>;
    public sourceFilter: ElasticSearchSourceFilter;
    public startDate: Date;
    public endDate: Date;
    public pageSize: number;
    public page: number;

    constructor(page = 0, pageSize = 250, tenantId?) {
        this.page = page;
        this.pageSize = pageSize;
        this.tenantId = tenantId;
    }

    public withDateRange(start: Date, end: Date): ElasticSearchQuery {
        this.startDate = start;
        this.endDate = end;
        return this;
    }
}
