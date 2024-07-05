import { BaseGraph } from "./BaseGraph";

export class BipartiteGraph extends BaseGraph{
    constructor(parent: any);

    // @ts-ignore
    newNode(nodeId: number|string, type: 0|1): this;
    // @ts-ignore
    newNode(nodeId: number|string, value: any, type: 0|1): this;
}