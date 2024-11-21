import { SDNode }    from "@/Node/SDNode";
import { BaseArray } from "@/Node/Array/BaseArray";

export class Pile extends BaseArray {
    constructor(parent: SDNode);

    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}