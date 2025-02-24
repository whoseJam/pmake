import { BaseArray } from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 数组组件
 * 
 * 数组的每个元素都是一个 Box 组件，且从左往右排列
 */
export class Array extends BaseArray {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取数组每个元素的宽度
     */
    elementWidth(): number;

    /**
     * 设置数组每个元素的宽度
     * @param width 每个 Box 组件的宽度
     */
    elementWidth(width: number): this;

    /**
     * 获取数组每个元素的高度
     */
    elementHeight(): number;

    /**
     * 设置数组每个元素的高度
     * @param height 每个 Box 组件的高度
     */
    elementHeight(height: number): this;
}
