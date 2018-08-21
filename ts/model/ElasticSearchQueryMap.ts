import { ElasticsearchQueryField } from './ElasticsearchQueryField';
import { IHash } from './IHash';

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
