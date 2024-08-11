import { SDNode }    from "SD/Node/SDNode";
import { D3Layer }   from "SD/Node/SDNode/D3Layer";
import { BaseGraph } from "SD/Node/Graph/BaseGraph";

export class GridGraph extends BaseGraph {
    constructor(parent: SDNode|D3Layer);

    n(): number;
    n(n: number): this;
    m(): number;
    m(m: number): this;
    at(i: number, j: number): this;
}