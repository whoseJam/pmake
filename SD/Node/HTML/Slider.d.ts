import { SDNode }   from "@/Node/SDNode";
import { BaseHTML } from "@/Node/HTML/BaseHTML";

export class Slider extends BaseHTML {
    constructor(parent: SDNode);

    max(): number;
    max(max: number): this;
    min(): number;
    min(min: number): this;
    value(): number;
    value(value: number): this;

    onChange(callback: (value: number) => void): this;
}