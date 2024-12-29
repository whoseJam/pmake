import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";

export class HorizontalValueTree extends BaseTree {
    constructor(parent: SDNode);

    layerWidth(): number;
    layerWidth(height: number): this;
}