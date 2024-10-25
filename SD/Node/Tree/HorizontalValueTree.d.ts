import { SDNode }   from "SD/Node/SDNode";
import { BaseTree } from "SD/Node/Tree/BaseTree";

export class HorizontalValueTree extends BaseTree {
    constructor(parent: SDNode);

    layerHeight(): number;
    layerHeight(height: number): this;
}