import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { SDNode } from "@/Node/SDNode";

export class BipartiteGraph extends BaseGraph {
    constructor(parent: SDNode);

    newNode(nodeId: number | string, type: 0 | 1): this;
    newNode(nodeId: number | string, value: any, type: 0 | 1): this;
}