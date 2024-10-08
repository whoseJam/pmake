import { SDNode }    from "SD/Node/SDNode";
import { BaseArray } from "SD/Node/Array/BaseArray";

export class Array extends BaseArray {
    constructor(parent: SDNode);

    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}