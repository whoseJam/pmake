import { BaseArray } from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Code 组件
 *
 * 此组件可以把多行代码线性组织起来，把每一行代码视作数组中的一个元素
 *
 * 此组件的默认行号是从 1 开始的
 */
export class Code extends BaseArray {
    constructor(parent: SDNode | RenderNode);
    constructor(parent: SDNode | RenderNode, source: string);

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
     * @param fontSize 字体大小
     */
    fontSize(fontSize: number): this;

    /**
     * 设置代码块的内容
     * @param source 源代码，会自动对起始/结尾的空行进行裁剪
     */
    code(source: string): this;

    /**
     * 取消高亮
     * @param no
     */
    focus(no: false | null | undefined): this;

    /**
     * 设置高亮到指定单行代码
     * @param row 高亮行号
     */
    focus(row: number): this;

    /**
     * 设置高亮从第 l 行到第 r 行
     * @param l 高亮起始行号
     * @param r 高亮终止行号
     */
    focus(l: number, r: number): this;
}
