import { Array }   from "SD/Node/Array/Array";
import { SDNode }  from "SD/Node/SDNode";

export class ValueArray extends Array {
    constructor(parent: SDNode);

    align(): "y"|"cy"|"my";
    align(align: "y"|"cy"|"my"): this;
}