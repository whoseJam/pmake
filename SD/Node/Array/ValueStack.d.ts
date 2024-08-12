import { Stack }   from "SD/Node/Array/Stack";
import { SDNode }  from "SD/Node/SDNode";
import { D3Layer } from "SD/Node/SDNode/D3Layer";

export class ValueStack extends Stack {
    constructor(parent: SDNode|D3Layer);
}