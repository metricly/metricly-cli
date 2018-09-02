import { View } from './report/View';
import { ViewDefinition } from './report/ViewDefinition';

export class Report {
    public static fromJSON(json: string): Report {
        const user = Object.create(Report.prototype);
        return Object.assign(user, json);
    }

    public id: string;
    public name: string;
    public type: string;
    public active: boolean;
    public startDate: Date;
    public endDate: Date;
    public views: View[];
    public viewDefinitions: ViewDefinition[];
    public parameters: string[];
}
