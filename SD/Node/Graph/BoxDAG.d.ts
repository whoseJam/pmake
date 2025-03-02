import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { DAG } from "@/Node/Graph/DAG";

/**
 * 箱子有向无环图组件
 */
export class BoxDAG extends DAG {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取箱子的宽度
     */
    elementWidth(): number;

    /**
     * 设置箱子的宽度
     * @param width
     */
    elementWidth(width: number): this;

    /**
     * 获取箱子的高度
     */
    elementHeight(): number;

    /**
     * 设置箱子的高度
     * @param height 
     */
    elementHeight(height: number): this;
}