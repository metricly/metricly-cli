export class ElasticsearchQueryField<K, V> {
    public key: K;
    public value: V;
    public contains;
    public literal;
    public queryType: string;

    constructor(key, value, literal = false, contains = true) {
        this.key = key;
        this.value = value;
        this.contains = contains;
        this.literal = literal;
    }
}
