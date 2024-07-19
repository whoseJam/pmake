import { BaseHTML } from "./BaseHTML";

export class Input extends BaseHTML {
    constructor(parent: any);

    value(): string;
    label(): string;
    label(label: string): this;
}