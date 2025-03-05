import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * EllipseVertex 组件
 *
 * 其 background 是一个 Ellipse
 */
export class EllipseVertex extends BaseElement {
    constructor(parent: SDNode | RenderNode);
}
