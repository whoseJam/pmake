import { Array } from "@/Node/Array/Array";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type Align = "y" | "cy" | "my";

/**
 * ValueArray 组件
 *
 * 此组件的每个元素可以是任意的 SDNode 组件，且从左往右排列
 *
 * 此组件并不会管理内部元素的长宽，但会管理相邻两个内部元素之间的间距
 */
export class ValueArray extends Array {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取此组件的对齐方式
     */
    align(): Align;

    /**
     * 设置此组件的对齐方式
     * - "y"：内部元素在此组件的最上方对齐
     * - "cy"：内部元素在此组件 y 方向的中线上对齐
     * - "my"：内部元素在此组件的最下方对齐
     * @param align 对齐方式
     */
    align(align: Align): this;
}
