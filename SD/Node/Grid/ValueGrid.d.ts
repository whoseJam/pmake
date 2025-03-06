import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * ValueGrid 组件。
 * 
 * 此组件继承自 Grid，提供更灵活的网格布局功能：
 * 
 * 布局特性：
 * - 元素类型：支持任意 SDNode 类型的元素。
 * - 尺寸自由：元素可以有不同的宽度和高度。
 * - 中心对齐：保证所有元素的中心点对齐到网格布局点。
 * 
 * 与 Grid 的区别：
 * - Grid 要求所有元素使用统一的 Box 容器和尺寸。
 * - ValueGrid 允许元素保持原有尺寸，只控制中心点位置。
 * 
 * 使用场景：
 * - 不规则元素的网格排列。
 * - 混合尺寸元素的布局。
 * - 保持元素原始尺寸的场景。
 */
export class ValueGrid extends Grid {
    constructor(parent: SDNode | RenderNode);

    /**
     * 在指定位置插入一个新的值元素。
     * 
     * 特性：
     * - 直接使用原始节点，不创建额外容器。
     * - 保持元素原有尺寸。
     * - 将元素中心点对齐到网格点。
     * - 自动添加淡入动画效果。
     * 
     * @param i 行索引。
     * @param j 列索引。
     * @param value 要插入的节点元素。
     * @returns this 用于支持链式调用。
     */
    insert(i: number, j: number, value: SDNode): this;
}
