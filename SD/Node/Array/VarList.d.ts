import { SDNode } from "../SDNode";
import { BaseArray } from "./BaseArray";

export class VarList extends BaseArray {
    constructor(parent: any);

    fontSize(): number;
    fontSize(fontSize: number): this;

    put(key: number|string, value: number|string): this;
    get(key: number|string): number|string|undefined;

    element(key: number|string): SDNode;

    inc(key: number|string): this;
    dec(key: number|string): this;
    incBy(key: number|string, delta: number): this;

}