import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 小图组件
 * 
 * 最多容纳不超过 6 个节点
 */
export class TinyGraph extends BaseGraph {
    constructor(parent: SDNode | RenderNode);
}