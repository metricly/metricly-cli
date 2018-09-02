export class ReportScope {
    public view: string;
    public parameters: {};
    public rowLimit: number;
    public withViewDefinitions: boolean;

    constructor(view, parameters = {}, rowLimit = 20, withViewDefinitions = false) {
        this.view = view;
        this.parameters = parameters;
        this.rowLimit = rowLimit;
        this.withViewDefinitions = withViewDefinitions;
    }
}
