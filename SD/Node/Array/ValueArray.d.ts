import { Array }   from "SD/Node/Array/Array";
import { SDNode }  from "SD/Node/SDNode";
import { D3Layer } from "SD/Node/SDNode/D3Layer";

export class ValueArray extends Array {
    constructor(parent: SDNode|D3Layer);

    align(): "y"|"cy"|"my";
    align(align: "y"|"cy"|"my"): this;
}