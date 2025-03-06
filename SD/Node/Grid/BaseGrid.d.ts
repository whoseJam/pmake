import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDColor } from "@/Utility/Color";

/**
 * BaseGrid 组件。
 * 
 * 此组件继承自 SDNode，提供二维网格的基础功能：
 * - 网格管理：支持动态调整网格大小和形状。
 * - 元素操作：支持访问和修改网格中的元素。
 * - 坐标系统：支持逻辑坐标和物理坐标的转换。
 * - 样式控制：支持设置元素的颜色和透明度。
 * 
 * 特性：
 * - 支持不规则网格（如三角形网格）。
 * - 支持动态扩展行列。
 * - 支持元素的批量操作。
 * 
 * 使用场景：
 * - 表格数据展示。
 * - 游戏棋盘实现。
 * - 矩阵可视化。
 * 
 * @extends {SDNode}
 */
export class BaseGrid extends SDNode {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取网格第一维度（行）的起始索引。
     * @returns 当前的起始行索引。
     */
    startN(): number;

    /**
     * 设置网格第一维度（行）的起始索引。
     * 
     * 使用场景：
     * - 调整网格的显示范围。
     * - 实现滚动效果。
     * 
     * @param start 起始行索引。
     * @returns this 用于支持链式调用。
     */
    startN(start: number): this;

    /**
     * 获取网格第二维度（列）的起始索引。
     * @returns 当前的起始列索引。
     */
    startM(): number;

    /**
     * 设置网格第二维度（列）的起始索引。
     * 
     * 使用场景：
     * - 调整网格的显示范围。
     * - 实现滚动效果。
     * 
     * @param start 起始列索引。
     * @returns this 用于支持链式调用。
     */
    startM(start: number): this;

    /**
     * 获取网格第一维度（行）的终止索引。
     * @returns 当前的终止行索引。
     */
    endN(): number;

    /**
     * 获取网格第二维度（列）的终止索引。
     * @returns 当前的终止列索引。
     */
    endM(): number;

    /**
     * 获取特定行的列终止索引。
     * 
     * 此方法在处理不规则网格时特别有用，例如：
     * - 三角形网格。
     * - 阶梯状网格。
     * - 不规则形状网格。
     * 
     * @param index 行索引。
     * @returns 指定行的列终止索引。
     */
    endM(index: number): number;

    /**
     * 将第一维度（行）的逻辑坐标转换为物理坐标。
     * 
     * 使用场景：
     * - 计算元素实际位置。
     * - 处理网格布局。
     * 
     * @param index 行的逻辑坐标。
     * @returns 对应的物理坐标。
     */
    idxN(index: number): number;

    /**
     * 将第二维度（列）的逻辑坐标转换为物理坐标。
     * 
     * 使用场景：
     * - 计算元素实际位置。
     * - 处理网格布局。
     * 
     * @param index 列的逻辑坐标。
     * @returns 对应的物理坐标。
     */
    idxM(index: number): number;

    /**
     * 设置网格的行数。
     * @param n 行数。
     * @returns this 用于支持链式调用。
     */
    n(n: number): this;

    /**
     * 设置网格的列数。
     * @param m 列数。
     * @returns this 用于支持链式调用。
     */
    m(m: number): this;

    /**
     * 在网格中添加新列。
     * @returns this 用于支持链式调用。
     */
    pushCol(): this;

    /**
     * 在网格中添加新列，并填充指定数量的元素。
     * 
     * 注意：元素数量不能超过网格的行数。
     * 
     * @param count 要添加的元素数量。
     * @returns this 用于支持链式调用。
     */
    pushCol(count: number): this;

    /**
     * 在网格中添加新行。
     * @returns this 用于支持链式调用。
     */
    pushRow(): this;

    /**
     * 在网格中添加新行，并填充指定数量的元素。
     * @param count 要添加的元素数量。
     * @returns this 用于支持链式调用。
     */
    pushRow(count: number): this;

    /**
     * 获取网格中指定位置的元素。
     * @param i 行索引。
     * @param j 列索引。
     * @returns 指定位置的元素节点。
     */
    element(i: number, j: number): SDNode;

    /**
     * 遍历网格中的所有元素。
     * 
     * 使用场景：
     * - 批量更新元素。
     * - 数据统计和计算。
     * - 状态检查。
     * 
     * @param callback 处理每个元素的回调函数。
     * @returns this 用于支持链式调用。
     */
    forEachElement(callback: (element: SDNode, rowId: number, colId: number) => void): this;

    /**
     * 获取指定位置元素的值。
     * @param i 行索引。
     * @param j 列索引。
     * @returns 元素的值节点。
     */
    value(i: number, j: number): SDNode;

    /**
     * 设置指定位置元素的值。
     * @param i 行索引。
     * @param j 列索引。
     * @param value 要设置的值。
     * @returns this 用于支持链式调用。
     */
    value(i: number, j: number, value: SDNode): this;

    /**
     * 获取指定位置元素的文本内容。
     * @param i 行索引。
     * @param j 列索引。
     * @returns 元素的文本内容。
     */
    text(i: number, j: number): string;

    /**
     * 获取指定位置元素的数值。
     * 
     * 此方法会尝试将元素的文本内容转换为数值：
     * - 如果转换成功，返回转换后的数值。
     * - 如果转换失败，返回默认值。
     * 
     * @param i 行索引。
     * @param j 列索引。
     * @returns 转换后的数值。
     */
    intValue(i: number, j: number): number;

    /**
     * 获取指定位置元素的透明度。
     * @param i 行索引。
     * @param j 列索引。
     * @returns 当前的透明度值。
     */
    opacity(i: number, j: number): number;

    /**
     * 设置指定位置元素的透明度。
     * @param i 行索引。
     * @param j 列索引。
     * @param opacity 透明度值。
     * @returns this 用于支持链式调用。
     */
    opacity(i: number, j: number, opacity: number): this;

    /**
     * 设置网格所有元素的颜色。
     * @param color 要设置的颜色。
     * @returns this 用于支持链式调用。
     */
    color(color: SDColor): this;

    /**
     * 获取指定位置元素的颜色。
     * @param i 行索引。
     * @param j 列索引。
     * @returns 当前的颜色值。
     */
    color(i: number, j: number): SDColor;

    /**
     * 设置指定位置元素的颜色。
     * @param i 行索引。
     * @param j 列索引。
     * @param color 要设置的颜色。
     * @returns this 用于支持链式调用。
     */
    color(i: number, j: number, color: SDColor): this;
}
