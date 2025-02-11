import { BaseArray } from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";

export class Code extends BaseArray {
    constructor(parent: SDNode);
    constructor(parent: SDNode, source: string);

    /**
     * 获取高亮起始行
     */
    l(): number;

    /**
     * 获取高亮终止行
     */
    r(): number;

    /**
     * 获取代码块的字体大小
     */
    fontSize(): number;

    /**
     * 设置代码块的字体大小
     * @param fontSize
     */
    fontSize(fontSize: number): this;

    /**
     * 设置代码块的内容
     * @param source
     */
    code(source: string): this;

    /**
     * 取消高亮
     * @param l
     */
    focus(no: false | null | undefined): this;

    /**
     * 设置高亮到第 row 行
     * @param row
     */
    focus(row: number): this;

    /**
     * 设置高亮从第 l 行到第 r 行
     * @param l
     * @param r
     */
    focus(l: number, r: number): this;
}
