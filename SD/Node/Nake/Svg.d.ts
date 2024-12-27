import { SDNode } from "@/Node/SDNode";

type viewBox = {
    x: number,
    y: number,
    width: number,
    height: number
};

export class Svg extends SDNode {
    constructor(parent: SDNode);

    /**
     * 获取该节点的viewBox
     */
    viewBox(): viewBox;

    /**
     * 设置该节点的viewBox
     * @param viewBox 
     */
    viewBox(viewBox: viewBox): this;

    /**
     * 设置该元素的viewBox
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     */
    viewBox(x: number, y: number, width: number, height: number): this;
}