import { BaseArray } from "@/Node/Array/BaseArray";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * BarArray 组件
 *
 * 此组件的每个 element 是一个 Rect，元素值越大，则 Rect 越高
 */
export class BarArray extends BaseArray {
    constructor(parent: SDNod | RenderNode);

    /**
     * 获取 BarArray 每个 element 的宽度
     */
    elementWidth(): number;

    /**
     * 设置 BarArray 每个 element 的宽度
     * @param width 每个 Rect 组件的宽度
     */
    elementWidth(width: number): this;

    /**
     * 获取 BarArray 单位 1 的高度
     */
    elementHeight(): number;

    /**
     * 设置 BarArray 单位 1 的高度
     *
     * 假设数组的某个 element 的值为 3，则该元素的高度为 3 倍的单位 1 高度
     * @param height 每个 Rect 组件的单位 1 高度
     */
    elementHeight(height: number): this;
}
