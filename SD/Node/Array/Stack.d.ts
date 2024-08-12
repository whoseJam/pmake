import { SDNode }    from "SD/Node/SDNode";
import { D3Layer }   from "SD/Node/SDNode/D3Layer";
import { BaseArray } from "SD/Node/Array/BaseArray";

export class Stack extends BaseArray {
    constructor(parent: SDNode|D3Layer);

    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}