import { ViewDefinition } from './ViewDefinition';

export class ReportContent {
    public static fromJSON(json: string): ReportContent {
        const reportContent = Object.create(ReportContent.prototype);
        return Object.assign(reportContent, json);
    }

    public content: any;
    public reportId: string;
    public tenantId: string;
    public view: string;
    public viewDefinition: ViewDefinition;
}
