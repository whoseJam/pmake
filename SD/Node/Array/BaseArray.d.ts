import { Color } from "SD/Utility/Color";
import { SDNode } from "../SDNode";

export class BaseArray extends SDNode {
    constructor(parent: any);

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

    idx(index: number): number;
    element(index: number): SDNode;
    lastElement(): SDNode;
    firstElement(): SDNode;

    push(value: any): this;
    pushArray(array: Array<any>): this;
    pushFromExistValue(value: SDNode): this;
    pushFromExistElement(value: SDNode): this;
    pop(): this;

    erase(index: number): this;
    dropElement(index: number): SDNode;
    dropValue(index: number): SDNode;

    text(index: number): string;
    intValue(index: number): number;

    opacity(): number;
    opacity(opacity: number): this;
    opacity(index: number): number;
    opacity(index: number, opacity: number): this;

    value(index: number): SDNode;
    value(index: number, value: SDNode): this

    color(color: Color): this;
    color(index: number): Color;
    color(index: number, color: Color): this;
    color(l: number, r: number, color: Color): this;
}