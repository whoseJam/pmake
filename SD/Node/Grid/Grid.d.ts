import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 网格的主轴类型。
 * - row: 行优先布局。
 * - col: 列优先布局。
 */
type Axis = "row" | "col";

/**
 * 网格的对齐方式。
 * - x: 左对齐。
 * - y: 顶对齐。
 * - cx: 水平居中。
 * - cy: 垂直居中。
 * - mx: 右对齐。
 * - my: 底对齐。
 */
type Align = "x" | "y" | "cx" | "cy" | "mx" | "my";

/**
 * Grid 组件。
 * 
 * 此组件继承自 BaseGrid，提供增强的网格布局功能。每个网格元素都是一个 Box 组件，具有以下特点：
 * 
 * 布局系统：
 * - 行优先布局：元素从上到下排列，支持行内的水平对齐（左对齐/居中/右对齐）。
 * - 列优先布局：元素从左到右排列，支持列内的垂直对齐（顶对齐/居中/底对齐）。
 * 
 * 元素特性：
 * - 统一尺寸：所有元素具有相同的宽度和高度。
 * - 动画效果：支持元素的淡入淡出动画。
 * 
 * 默认行为：
 * - 默认主轴：行优先（row）。
 * - 默认对齐：左对齐（x）。
 */
export class Grid extends BaseGrid {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取网格的主轴方向。
     * @returns 当前的主轴设置（row 或 col）。
     */
    axis(): Axis;

    /**
     * 设置网格的主轴方向。
     * @param axis 主轴方向，row 为行优先，col 为列优先。
     * @returns this 用于支持链式调用。
     */
    axis(axis: Axis): this;

    /**
     * 获取网格的对齐方式。
     * @returns 当前的对齐方式。
     */
    align(): Align;

    /**
     * 设置网格的对齐方式。
     * 
     * 对齐效果：
     * - 行优先时影响水平方向。
     * - 列优先时影响垂直方向。
     * 
     * @param align 对齐方式。
     * @returns this 用于支持链式调用。
     */
    align(align: Align): this;

    /**
     * 获取网格元素的统一宽度。
     * @returns 当前设置的元素宽度（像素）。
     */
    elementWidth(): number;

    /**
     * 设置网格元素的统一宽度。
     * @param width 元素宽度（像素）。
     * @returns this 用于支持链式调用。
     */
    elementWidth(width: number): this;

    /**
     * 获取网格元素的统一高度。
     * @returns 当前设置的元素高度（像素）。
     */
    elementHeight(): number;

    /**
     * 设置网格元素的统一高度。
     * @param height 元素高度（像素）。
     * @returns this 用于支持链式调用。
     */
    elementHeight(height: number): this;

    /**
     * 获取网格的总宽度。
     * @returns 当前网格的总宽度（像素）。
     */
    width(): number;

    /**
     * 设置网格的总宽度。
     * @param width 网格总宽度。
     * @returns this 用于支持链式调用。
     */
    width(width: number): this;

    /**
     * 获取网格的总高度。
     * @returns 当前网格的总高度。
     */
    height(): number;

    /**
     * 设置网格的总高度。
     * 会根据主轴方向自动计算并设置元素高度：
     * @param height 网格总高度。
     * @returns this 用于支持链式调用。
     */
    height(height: number): this;

    /**
     * 在指定位置插入一个新的元素。
     * 
     * 特性：
     * - 自动创建 Box 容器。
     * - 添加淡入动画效果。
     * - 自动计算元素位置。
     * 
     * @param i 行索引。
     * @param j 列索引。
     * @param value 要插入的内容。
     * @returns this 用于支持链式调用。
     */
    insert(i: number, j: number, value: SDNode): this;

    /**
     * 删除指定位置的元素。
     * 
     * 特性：
     * - 添加淡出动画效果。
     * - 动画结束后自动移除元素。
     * 
     * @param i 行索引。
     * @param j 列索引。
     * @returns this 用于支持链式调用。
     */
    erase(i: number, j: number): this;
}
