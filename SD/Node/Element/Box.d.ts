import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 箱子元素组件
 * 
 * 其背景是一个矩形
 */
export class Box extends BaseElement {
    constructor(parent: SDNode | RenderNode);
}
