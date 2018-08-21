import { Tag } from './Tag';

export class Metric {
    public dataSourceId: number;
    public id: string;
    public fqn: string;
    public name: string;
    public unit: string;
    public type: string;
    public sparseDataStrategy: string;
    public tags: Tag[];
}
