import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * EllipseVertex 组件。
 * 
 * 此组件继承自 BaseElement，专门用于表示图形中的椭圆形顶点：
 * - background：使用椭圆形状。
 * - value：通常用于显示顶点的标识或数据。
 */
export class EllipseVertex extends BaseElement {
    constructor(parent: SDNode | RenderNode);
}
