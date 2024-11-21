import { Color } from "SD/Utility/Color";
import { SDNode } from "../SDNode";

export class BaseGrid extends SDNode {
    constructor(parent: any);

    startN(): number;
    startN(start: number): this;
    startM(): number;
    startM(start: number): this;
    endN(): number;
    endM(): number;
    endM(index: number): number;

    idxN(index: number): number;
    idxM(index: number): number;
    n(n: number): this;
    m(m: number): this;

    pushCol(): this
    pushCol(rows: number): this;

    pushRow(columns: number): this;

    element(i: number, j: number): SDNode;

    /**
     * 获取指定位置元素的 value
     * @param i 
     * @param j 
     */
    value(i: number, j: number): SDNode;

    /**
     * 设置指定位置元素的 value
     * @param i 
     * @param j 
     * @param value 
     */
    value(i: number, j: number, value: SDNode): this;

    /**
     * 获取指定位置元素的 value，并以 int 值返回
     * @param i 
     * @param j 
     */
    intValue(i: number, j: number): number;

    opacity(): number;
    opacity(opacity: number): this;

    /**
     * 获取指定位置元素的透明度
     * @param i 
     * @param j 
     */
    opacity(i: number, j: number): number;

    /**
     * 设置指定位置元素的透明度
     * @param i 
     * @param j 
     * @param opacity 
     */
    opacity(i: number, j: number, opacity: number): this;

    color(color: Color): this;

    /**
     * 获取指定位置元素的颜色
     * @param i 
     * @param j 
     */
    color(i: number, j: number): Color;

    /**
     * 设置指定位置元素的颜色
     * @param i 
     * @param j 
     * @param color 
     */
    color(i: number, j: number, color: Color): Color;

    forEachElement(callback: (element: SDNode, rowId: number, colId: number) => void): this;
}