import { Element } from './Element';

export class Page {
    public content: Element[];
    public first: boolean;
    public last: boolean;
    public number: number;
    public numberOfElements: number;
    public size: number;
    public sort: object;
    public totalElements: number;
    public totalPages: number;
}
