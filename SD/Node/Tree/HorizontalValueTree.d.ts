import { SDNode }   from "SD/Node/SDNode";
import { D3Layer }  from "SD/Node/SDNode/D3Layer";
import { BaseTree } from "SD/Node/Tree/BaseTree";

export class HorizontalValueTree extends BaseTree {
    constructor(parent: SDNode|D3Layer);
}