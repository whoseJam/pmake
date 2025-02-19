import { Array } from "@/Node/Array/Array";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type Align = "y" | "cy" | "my";

/**
 * 价值物数组组件
 * 
 * 数组的每个元素可以是任意的 SDNode 组件，且从左往右排列
 */
export class ValueArray extends Array {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取价值物数组的对齐方式
     */
    align(): Align;

    /**
     * 设置价值物数组的对齐方式
     * @param align 对齐方式
     */
    align(align: Align): this;
}
