import { Color } from "SD/Utility/Color";

import { SDNode } from "SD/Node/SDNode";

export class BaseArray extends SDNode {
    constructor(parent: SDNode);

    start(): number;
    start(start: number): this;
    end(): number;
    length(): number;
    length(length: number): this;

    /**
     * 设置序列的长度
     * @param length 目标长度 
     */
    resize(length: number): this;

    idx(idx: number): number;
    element(idx: number): SDNode;
    lastElement(): SDNode;
    firstElement(): SDNode;

    push(value: any): this;
    pushArray(array: Array<any>): this;
    pushFromExistValue(value: SDNode): this;
    pushFromExistElement(value: SDNode): this;
    pop(): this;

    erase(idx: number): this;
    dropElement(idx: number): SDNode;
    dropFirstElement(idx: number): SDNode;
    dropLastElement(idx: number): SDNode;
    dropValue(idx: number): SDNode;

    text(idx: number): string;
    intValue(idx: number): number;

    opacity(): number;
    opacity(opacity: number): this;
    opacity(idx: number): number;
    opacity(idx: number, opacity: number): this;

    value(idx: number): SDNode;
    value(idx: number, value: SDNode): this

    color(color: Color): this;
    color(idx: number): Color;
    color(idx: number, color: Color): this;
    color(l: number, r: number, color: Color): this;

    /**
     * 对数组内部元素做排序
     * 
     * @param comparator 自定义比较器
     */
    sort(comparator: (a: SDNode, b: SDNode) => boolean): this;
}