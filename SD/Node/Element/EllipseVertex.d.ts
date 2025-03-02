import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 椭圆元素组件
 * 
 * 其背景是一个椭圆
 */
export class EllipseVertex extends BaseElement {
    constructor(parent: SDNode | RenderNode);
}
