import { BaseTree } from "./BaseTree";

export class BoxTree extends BaseTree {
    constructor(parent: any);

    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
    layerHeight(): number;
    layerHeight(height: number): this;
}