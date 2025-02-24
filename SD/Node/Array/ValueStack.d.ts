import { Stack } from "@/Node/Array/Stack";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type Align = "x" | "cx" | "mx";

/**
 * 价值物栈型数组组件
 * 
 * 数组的每个元素可以是任意的 SDNode 组件，且从上往下排列
 */
export class ValueStack extends Stack {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取价值物数组的对齐方式
     */
    align(): Align;

    /**
     * 设置价值物数组的对齐方式
     * @param align
     */
    align(align: Align): this;
}
