import { BaseTree } from "./BaseTree";

export class HorizontalTree extends BaseTree {
    constructor(parent: any);

    r(): number;
    r(r: number): this;
    layerHeight(): number;
    layerHeight(height: number): this;
}