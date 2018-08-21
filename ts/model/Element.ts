import { Attribute } from './Attribute';
import { Check } from './Check';
import { Metric } from './Metric';
import { Relation } from './Relation';
import { Sample } from './Sample';
import { Tag } from './Tag';

export class Element {
    public tenantId: string;
    public id: string;
    public fqn: string;
    public name: string;
    public type: string;
    public location: string;
    public lastSeen: Date;
    public lastProcessed: Date;
    public attributes: Attribute[] = [];
    public tags: Tag[] = [];
    public metrics: Metric[] = [];
    public relations: Relation[] = [];
    public samples: Sample[] = [];
    public checks: Check[] = [];

    public getAttributeOrElse(name: string, fallback: string = null): string {
        const attribute = this.attributes.find((entry) => entry.name === name);
        return attribute ? attribute.value : null;
    }
}
