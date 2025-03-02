import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 二分图组件
 */
export class BipartiteGraph extends BaseGraph {
    constructor(parent: SDNode | RenderNode);

    /**
     * 新建一个节点，并设置节点类别
     * @param id 节点编号
     * @param no 节点类别
     */
    newNode(id: number | string, no: 0 | 1): this;

    /**
     * 新建一个节点，并设置节点价值物与节点类别
     * @param id 节点编号
     * @param value 节点价值物
     * @param no 节点类别
     */
    newNode(id: number | string, value: any, no: 0 | 1): this;
}
