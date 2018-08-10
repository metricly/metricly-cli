/* tslint:disable:max-classes-per-file */

import { Element } from './Element';

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

export class ElasticsearchQueryField<K, V> {
    public key: K;
    public value: V;
    public contains: boolean = true;
    public literal: boolean = true;
    public queryType: string;

    constructor(key, value, literal = false, contains = true) {
        this.key = key;
        this.value = value;
        this.contains = contains;
        this.literal = literal;
    }
}

export class ElasticSearchQueryItem<T> {
    public literal: boolean = true;
    public contains: boolean = true;
    public queryType: string;
    public item: T;

    constructor(item, literal = false, contains = true) {
        this.item = item;
        this.literal = literal;
        this.contains = contains;
    }
}

export class ElasticSearchQueryList<T> {
    public static withItems<T>(items: T[], and = false, literal = false, contains = true): ElasticSearchQueryList<T> {
        const queryItems = items.map((item) => new ElasticSearchQueryItem<T>(item, literal, contains));

        return new ElasticSearchQueryList<T>(queryItems, and);
    }

    public static withItem<T>(item: T, and = false, literal = false, contains = true): ElasticSearchQueryList<T> {
        const queryItems = [new ElasticSearchQueryItem<T>(item, literal, contains)];

        return new ElasticSearchQueryList<T>(queryItems, and);
    }

    public and: boolean = true;
    public items: Array<ElasticSearchQueryItem<T>>;
    public nestedItems: Array<ElasticSearchQueryList<T>>;

    constructor(items: Array<ElasticSearchQueryItem<T>>, and = true, nestedItems?) {
        this.items = items;
        this.and = and;
        this.nestedItems = nestedItems;
    }
}

export interface IHash<V> {
    [key: string]: V;
}

export class ElasticSearchQueryMap<K, V> {
    public static withItems<K, V>(items: Array<IHash<V>>, keyField: string, valueField: string, and = false, literal = true, contains = true): ElasticSearchQueryMap<K, V> {
        const queryItems = items.map((entry) => new ElasticsearchQueryField<K, V>(entry[keyField], entry[valueField], literal, contains));

        return new ElasticSearchQueryMap<K, V>(queryItems, and);
    }

    public and: boolean = true;
    public items: Array<ElasticsearchQueryField<K, V>> = [];
    public nestedItems: Array<ElasticSearchQueryMap<K, V>> = [];

    constructor(items: Array<ElasticsearchQueryField<K, V>>, and = true, nestedItems?) {
        this.items = items;
        this.and = and;
        this.nestedItems = nestedItems;
    }
}

export class ElasticSearchSortField {
    public field: string;
    public order: string = 'desc';
    public mode: string;
    public missing: string = '_last';
    public unmappedType: string;
    public nestedTermField: string;
    public nestedTermValue: string;

    constructor(field: string, order = 'asc', missing = '_last') {
        this.field = field;
        this.order = order;
        this.missing = missing;
    }
}

export class ElasticSearchSourceFilter {
    public includes: string[];
    public excludes: string[];

    constructor(includes?: string[], excludes?: string[]) {
        this.includes = includes;
        this.excludes = excludes;
    }
}

export class Page {
    public content: Element[];
    public first: boolean;
    public last: boolean;
    public number: number;
    public numberOfElements: number;
    public size: number;
    public sort: object;
    public totalElements: number;
    public totalPages: number;
}
