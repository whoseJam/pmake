import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Vertex 组件。
 * 
 * 此组件继承自 BaseElement，专门用于表示图形中的圆形顶点：
 * - background：使用正圆形状。
 * - value：通常用于显示顶点的标识或数据。
 */
export class Vertex extends BaseElement {
    /**
     * 创建一个新的 Vertex 实例。
     * @param parent 父节点，用于确定顶点在视图树中的位置。
     */
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取顶点的半径。
     * 
     * 使用场景：
     * - 获取当前大小。
     * - 计算布局距离。
     * - 确定碰撞范围。
     * 
     * @returns 当前的半径值（像素）。
     */
    r(): number;

    /**
     * 设置顶点的半径。
     * 
     * 使用场景：
     * - 调整顶点大小。
     * - 根据内容自适应。
     * - 实现缩放动画。
     * 
     * @param r 半径值（像素）。
     * @returns this 用于支持链式调用。
     */
    r(r: number): this;
}
