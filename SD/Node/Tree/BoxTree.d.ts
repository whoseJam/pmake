import { SDNode }   from "SD/Node/SDNode";
import { D3Layer }  from "SD/Node/SDNode/D3Layer";
import { BaseTree } from "SD/Node/Tree/BaseTree";

export class BoxTree extends BaseTree {
    constructor(parent: SDNode|D3Layer);

    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
    layerHeight(): number;
    layerHeight(height: number): this;
}