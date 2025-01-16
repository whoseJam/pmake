import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";

export function svg(): SVGNode;
export function div(): HTMLNode;

export class Root {
    static init();

    /**
     * 设置主 svg 画布的 viewBox
     * @param x 画布中元素的最小 x 坐标
     * @param y 画布中元素的最小 y 坐标
     * @param width 画布中元素的总宽度
     * @param height 画布中元素的总高度
     * @param rate 留白比例
     */
    static setViewBox(x: number, y: number, width: number, height: number, rate: number);
}
