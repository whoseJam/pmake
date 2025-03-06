import { BaseArray } from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Array 组件，用于创建水平排列的元素序列布局。
 * 
 * 此组件继承自 BaseArray，专门用于处理需要水平排列且大小一致的元素序列。
 * 每个元素都被封装在一个 Box 组件中，从左往右依次排列，保持统一的尺寸。
 * 添加的元素会自动在其 Box 中居中显示。
 * 
 * 特性：
 * - 水平布局：元素从左往右排列，符合阅读习惯。
 * - 统一尺寸：所有元素保持相同的宽度和高度。
 * - 自动居中：添加的元素在其容器中自动居中对齐。
 * - 灵活调整：支持动态调整元素的尺寸。
 * 
 * 常见应用场景：
 * - 数组数据结构的可视化展示。
 * - 水平导航菜单或工具栏。
 * - 图片或卡片的横向列表。
 * - 标签页或选项卡的布局。
 */
export class Array extends BaseArray {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取每个元素的宽度。
     * 
     * 使用场景：
     * - 在调整布局前获取当前宽度。
     * - 根据当前宽度计算其他尺寸。
     * - 在保存状态时记录宽度设置。
     * 
     * @returns 当前每个 Box 组件的宽度值。
     */
    elementWidth(): number;

    /**
     * 设置每个元素的宽度。
     * 
     * 使用场景：
     * - 根据数字位数设置合适宽度。
     * - 确保有足够空间容纳完整内容。
     * - 为图标预留适当的显示空间。
     * 
     * @param width 要设置的宽度值。
     * @returns this 用于支持链式调用。
     */
    elementWidth(width: number): this;

    /**
     * 获取每个元素的高度。
     * 
     * 使用场景：
     * - 在调整布局前获取当前高度。
     * - 根据当前高度计算其他尺寸。
     * - 在保存状态时记录高度设置。
     * 
     * @returns 当前每个 Box 组件的高度值。
     */
    elementHeight(): number;

    /**
     * 设置每个元素的高度。
     * 
     * 使用场景：
     * - 单行内容：使用较小高度创建紧凑布局。
     * - 多行内容：预留足够空间避免内容截断。
     * - 图片展示：保持宽高比例确保显示完整。
     * 
     * @param height 要设置的高度值。
     * @returns this 用于支持链式调用。
     */
    elementHeight(height: number): this;
}
