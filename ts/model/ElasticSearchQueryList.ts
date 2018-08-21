import { ElasticSearchQueryItem } from './ElasticSearchQueryItem';

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
