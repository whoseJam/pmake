import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Box 组件
 *
 * 其 background 是一个 Rect
 */
export class Box extends BaseElement {
    constructor(parent: SDNode | RenderNode);
}
