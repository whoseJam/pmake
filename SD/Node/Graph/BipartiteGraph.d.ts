import { SDNode }    from "SD/Node/SDNode";
import { D3Layer }   from "SD/Node/SDNode/D3Layer";
import { BaseGraph } from "SD/Node/Graph/BaseGraph";

export class BipartiteGraph extends BaseGraph {
    constructor(parent: SDNode|D3Layer);

    // @ts-ignore
    newNode(nodeId: number|string, type: 0|1): this;
    // @ts-ignore
    newNode(nodeId: number|string, value: any, type: 0|1): this;
}