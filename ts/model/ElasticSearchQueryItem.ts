export class ElasticSearchQueryItem<T> {
    public literal;
    public contains;
    public queryType: string;
    public item: T;

    constructor(item, literal = false, contains = true) {
        this.item = item;
        this.literal = literal;
        this.contains = contains;
    }
}
