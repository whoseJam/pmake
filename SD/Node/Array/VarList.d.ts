import { SDNode }    from "@/Node/SDNode";
import { BaseArray } from "@/Node/Array/BaseArray";

export class VarList extends BaseArray {
    constructor(parent: SDNode);

    fontSize(): number;
    fontSize(fontSize: number): this;

    put(key: number|string, value: number|string): this;
    get(key: number|string): number|string|undefined;

    element(key: number|string): SDNode;

    inc(key: number|string): this;
    dec(key: number|string): this;
    incBy(key: number|string, delta: number): this;
}