import { SDNode }   from "SD/Node/SDNode";
import { BaseTree } from "SD/Node/Tree/BaseTree";

export class Tree extends BaseTree {
    constructor(parent: SDNode);

    r(): number;
    r(r: number): this;
    layerHeight(): number;
    layerHeight(height: number): this;
}

export function D3Layout(
    mode: "vertical"|"horizontal",
    transX: (node: {x: number, y: number}) => number,
    transY: (node: {x: number, y: number}) => number,
    setSize: (node: SDNode, limit: number) => void
);