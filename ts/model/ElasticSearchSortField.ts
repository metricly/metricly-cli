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
