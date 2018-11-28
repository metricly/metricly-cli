export class ReportViewScope {
    constructor(public view: any, public parameters = {}, public rowLimit = 20, public withViewDefinitions = false) { }
}
