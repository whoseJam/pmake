import { Stack } from "@/Node/Array/Stack";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type Align = "x" | "cx" | "mx";

/**
 * ValueStack 组件
 *
 * 此组件的每个元素可以是任意的 SDNode 组件，且从上往下排列
 *
 * 此组件并不会管理内部元素的长宽，但会管理相邻两个内部元素之间的间距
 */
export class ValueStack extends Stack {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取价值物数组的对齐方式
     */
    align(): Align;

    /**
     * 设置价值物数组的对齐方式
     * - "x"：内部元素在此组件的最左边对齐
     * - "cx"：内部元素在此组件 x 方向的中线上对齐
     * - "mx"：内部元素在此组件的最右边对齐
     * @param align 对齐方式
     */
    align(align: Align): this;
}
