/* tslint:disable: max-classes-per-file */
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

export class Attribute {
    public id: string;
    public dataSourceId: number;
    public name: string;
    public value: string;
    public attributeType: string;
}

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

export class Tag {
    public id: string;
    public dataSourceId: number;
    public name: string;
    public value: string;
}

export class Relation {
    public id: string;
    public dataSourceId: number;
    public fqn: string;
}

export class Sample {
    public timestamp: Date;
    public val: number;
    public min: number;
    public max: number;
    public avg: number;
    public sum: number;
    public cnt: number;
    public actual: number;
}

export class Check {
    public id: string;
    public tenantId: string;
    public name: string;
}
