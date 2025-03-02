import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 节点元素组件
 * 
 * 其背景是一个圆形
 */
export class Vertex extends BaseElement {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取节点元素组件的半径
     */
    r(): number;

    /**
     * 设置节点元素组件的半径
     * @param r 半径
     */
    r(r: number): this;
}
