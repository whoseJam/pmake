import { BaseArray } from "./BaseArray";

export class Code extends BaseArray {
    constructor(parent: any);

    l(): number;
    r(): number;
    fontSize(): number;
    fontSize(fontSize: number): this;

    code(source: string): this;

    focus(l: null): this;
    focus(l: number): this;
    focus(l: number, r: number): this;
}