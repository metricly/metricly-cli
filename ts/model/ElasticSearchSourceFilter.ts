export class ElasticSearchSourceFilter {
    public includes: string[];
    public excludes: string[];

    constructor(includes?: string[], excludes?: string[]) {
        this.includes = includes;
        this.excludes = excludes;
    }
}
