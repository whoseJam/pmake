import { BaseHTML } from "SD/Node/HTML/BaseHTML";

export class Slider extends BaseHTML {
    constructor(parent: any);

    max(): number;
    max(max: number): this;
    min(): number;
    min(min: number): this;
    value(): number;
    value(value: number): this;

    onChange(callback: (value: number) => void): this;
}