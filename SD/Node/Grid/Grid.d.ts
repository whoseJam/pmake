import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { SDNode } from "@/Node/SDNode";

type Axis = "row" | "col";
type Align = "x" | "y" | "cx" | "cy" | "mx" | "my";

export class Grid extends BaseGrid {
    constructor(parent: SDNode);

    /**
     * 获取网格主轴
     */
    axis(): Axis;

    /**
     * 设置网格主轴
     * @param axis
     */
    axis(axis: Axis): this;

    /**
     * 获取网格对齐方式
     */
    align(): Align;

    /**
     * 设置网格对齐方式
     * @param align
     */
    align(align: Align): this;
}
