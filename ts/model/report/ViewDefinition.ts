import { Field } from './Field';
import { Parameter } from './Parameter';

export class ViewDefinition {
    public name: string;
    public description: string;
    public parameters: Parameter[];
    public fields: Field[];
    public fieldNames: string[];
}
