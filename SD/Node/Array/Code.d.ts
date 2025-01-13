import { BaseArray } from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";

export class Code extends BaseArray {
    constructor(parent: SDNode);
    constructor(parent: SDNode, source: string);

    l(): number;
    r(): number;
    fontSize(): number;
    fontSize(fontSize: number): this;

    code(source: string): this;

    focus(l: null): this;
    focus(l: number): this;
    focus(l: number, r: number): this;
}
