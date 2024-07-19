import { BaseHTML } from "./BaseHTML";

export class Slider extends BaseHTML {
    constructor(parent: any);

    max(): number;
    max(max: number): this;
    min(): number;
    min(min: number): this;
    value(): number;

    onChange(callback: (value: number) => void): this;
}