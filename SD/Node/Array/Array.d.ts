import { BaseArray } from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Array 组件
 *
 * 此组件的每个 element 都是一个 Box 组件，且从左往右排列，每个元素拥有相同的长宽
 *
 * 在向此组件中添加 value 的时候，value 默认会被放置在 Box 中的居中位置
 */
export class Array extends BaseArray {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取 Array 每个 element 的宽度
     */
    elementWidth(): number;

    /**
     * 设置 Array 每个 element 的宽度
     * @param width 每个 Box 组件的宽度
     */
    elementWidth(width: number): this;

    /**
     * 获取 Array 每个 element 的高度
     */
    elementHeight(): number;

    /**
     * 设置 Array 每个 element 的高度
     * @param height 每个 Box 组件的高度
     */
    elementHeight(height: number): this;
}
