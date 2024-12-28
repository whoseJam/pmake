import { Array } from "@/Node/Array/Array";
import { SDNode } from "@/Node/SDNode";

type Align = "y" | "cy" | "my";

export class ValueArray extends Array {
    constructor(parent: SDNode);

    align(): Align;
    align(align: Align): this;
}