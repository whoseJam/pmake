import { SDNode }   from "SD/Node/SDNode";
import { BaseTree } from "SD/Node/Tree/BaseTree";

export class BoxTree extends BaseTree {
    constructor(parent: SDNode);

    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
    layerHeight(): number;
    layerHeight(height: number): this;
}