import { SDNode }   from "SD/Node/SDNode";
import { BaseTree } from "SD/Node/Tree/BaseTree";

export class HorizontalTree extends BaseTree {
    constructor(parent: SDNode);

    r(): number;
    r(r: number): this;
    layerHeight(): number;
    layerHeight(height: number): this;
}