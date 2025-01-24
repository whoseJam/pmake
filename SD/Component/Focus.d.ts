import { Rect } from "@/Node/Nake/Rect";
import { SDNode } from "@/Node/SDNode";

export class CompFocus {
    /**
     * 关注整个父元素
     */
    focus(): this;

    /**
     * 关注父元素的第 i 个子元素（认为父元素是数组）
     * @param i
     */
    focus(i: number): this;

    /**
     * 关注父元素的第 l 个到第 r 个子元素（认为父元素是数组）
     * @param l
     * @param r
     */
    focus(l: number, r: number): this;

    /**
     * 关注父元素的第 (i, j) 个子元素（认为父元素是网格）
     * @param i
     * @param j
     */
    focus(i: number, j: number): this;

    /**
     * 关注父元素的第 (i1, j1) 个子元素到第 (i2, j2) 个子元素（认为父元素是网格）
     * @param i1
     * @param j1
     * @param i2
     * @param j2
     */
    focus(i1: number, j1: number, i2: number, j2: number): this;

    /**
     * 关注元素占据区域
     * @param element
     */
    focus(element: SDNode): this;

    /**
     * 关注第一个元素到第二个元素这块区域
     * @param element1
     * @param element2
     */
    focus(element1: SDNode, element2: SDNode): this;

    /**
     * 取消关注
     * @param element
     */
    focus(element: null | undefined | false): this;
}

/**
 * 创建一个关注框
 * @param parent 父元素
 */
export function Focus(parent: SDNode): CompFocus & Rect;
