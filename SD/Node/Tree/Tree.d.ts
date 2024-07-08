import { BaseTree } from "./BaseTree";

export class Tree extends BaseTree {
    constructor(parent: any);

    r(): number;
    r(r: number): this;
    layerHeight(): number;
    layerHeight(height: number): this;
}