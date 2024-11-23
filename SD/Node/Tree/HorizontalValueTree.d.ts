import { SDNode }   from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";

export class HorizontalValueTree extends BaseTree {
    constructor(parent: SDNode);

    layerHeight(): number;
    layerHeight(height: number): this;
}