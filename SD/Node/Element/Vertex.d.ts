import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Vertex 组件
 *
 * 其 background 是一个 Circle
 */
export class Vertex extends BaseElement {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取 Vertex 的半径
     */
    r(): number;

    /**
     * 设置 Vertex 的半径
     * @param r 半径
     */
    r(r: number): this;
}
