import { ViewDefinition } from './report/ViewDefinition';
import { View } from './report/View';

export class Report {
    public id: string;
    public name: string;
    public type: string;
    public active: boolean;
    public startDate: Date;
    public endDate: Date;
    public views: View[];
    public viewDefinitions: ViewDefinition[];
    public parameters: string[];

    static fromJSON(json: string): Report {
        let user = Object.create(Report.prototype);
        return Object.assign(user, json);
      }
}