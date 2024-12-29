import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { SDNode } from "@/Node/SDNode";

type Axis = "row" | "col";
type Align = "x" | "y" | "mx" | "my";

export class Grid extends BaseGrid {
    constructor(parent: SDNode);

    axis(): Axis;
    axis(axis: Axis): this;
    align(): Align;
    align(align: Align): this;
}