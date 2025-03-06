import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Box 组件。
 * 
 * 此组件继承自 BaseElement，专门用于表示矩形容器：
 * - background：使用矩形形状。
 * - value：通常用于显示容器的内容。
 */
export class Box extends BaseElement {
    constructor(parent: SDNode | RenderNode);
}
