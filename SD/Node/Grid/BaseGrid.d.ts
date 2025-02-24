import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDColor } from "@/Utility/Color";

export class BaseGrid extends SDNode {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取网格第一维度的起始下标
     */
    startN(): number;

    /**
     * 设置网格第一维度的起始下标
     * @param start 起始下标
     */
    startN(start: number): this;

    /**
     * 获取网格第二维度的起始下标
     */
    startM(): number;

    /**
     * 设置网格第二维度的起始下标
     * @param start 起始下标
     */
    startM(start: number): this;

    /**
     * 获取网格第一维度的终止下标
     */
    endN(): number;

    /**
     * 获取网格第二维度的终止下标
     */
    endM(): number;

    /**
     * 获取网格第一维度为 index 时第二维度的终止下标
     *
     * 当网格并非是规则网格时（例如三角状的网格），这个函数会有作用
     * @param index 第一维度的下标
     */
    endM(index: number): number;

    /**
     * 将网格在第一维度上逻辑坐标转化为物理坐标
     * @param index 第一维度上的逻辑坐标
     */
    idxN(index: number): number;

    /**
     * 将网格在第一维度上逻辑坐标转化为物理坐标
     * @param index 第一维度上的逻辑坐标
     */
    idxM(index: number): number;

    /**
     * 设置网格第一维度上的容量
     * @param n 容量
     */
    n(n: number): this;

    /**
     * 设置网格第二维度上的容量
     * @param m 容量
     */
    m(m: number): this;

    /**
     * 网格的第二维度容量自增
     */
    pushCol(): this;

    /**
     * 网格的第二维度容量自增，且在新增的第二维度上放置 count 个元素
     *
     * 需保证 count 不能超过网格第一维度的容量
     * @param count 新增列内元素个数
     */
    pushCol(count: number): this;

    /**
     * 网格的第一维度容量自增
     */
    pushRow(): this;

    /**
     * 网格的第一维度容量自增，且在新增的第一维度上放置 count 个元素
     * @param count 新增行内元素个数
     */
    pushRow(count: number): this;

    /**
     * 获取网格指定下标对应的元素
     * @param i 指定元素在第一维度上的下标
     * @param j 指定元素在第二维度上的下标
     */
    element(i: number, j: number): SDNode;

    /**
     * 遍历网格中的每一个元素
     * @param callback 遍历元素的回调，在回调中可以按需处理网格中的每个元素
     */
    forEachElement(callback: (element: SDNode, rowId: number, colId: number) => void): this;

    /**
     * 获取网格指定元素的价值物
     * @param i 指定元素在第一维度上的下标
     * @param j 指定元素在第二维度上的下标
     */
    value(i: number, j: number): SDNode;

    /**
     * 设置网格指定元素的价值物
     * @param i 指定元素在第一维度上的下标
     * @param j 指定元素在第二维度上的下标
     * @param value 价值物
     */
    value(i: number, j: number, value: SDNode): this;

    /**
     * 获取网格指定元素的文本
     * @param i 指定元素在第一维度上的下标
     * @param j 指定元素在第二维度上的下标
     */
    text(i: number, j: number): string;

    /**
     * 获取网格指定元素的值
     *
     * 这会尝试把元素的文本转化为数值类型
     * @param i 指定元素在第一维度上的下标
     * @param j 指定元素在第二维度上的下标
     */
    intValue(i: number, j: number): number;

    /**
     * 获取网格指定元素的透明度
     * @param i 指定元素在第一维度上的下标
     * @param j 指定元素在第二维度上的下标
     */
    opacity(i: number, j: number): number;

    /**
     * 设置网格指定元素的透明度
     * @param i 指定元素在第一维度上的下标
     * @param j 指定元素在第二维度上的下标
     * @param opacity 透明度
     */
    opacity(i: number, j: number, opacity: number): this;

    /**
     * 设置网格所有元素的颜色
     * @param color
     */
    color(color: SDColor): this;

    /**
     * 获取网格指定元素的颜色
     * @param i 指定元素在第一维度上的下标
     * @param j 指定元素在第二维度上的下标
     */
    color(i: number, j: number): SDColor;

    /**
     * 设置网格指定元素的颜色
     * @param i 指定元素在第一维度上的下标
     * @param j 指定元素在第二维度上的下标
     * @param color 颜色
     */
    color(i: number, j: number, color: SDColor): this;
}
