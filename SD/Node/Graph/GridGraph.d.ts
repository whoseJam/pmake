import { SDNode }    from "SD/Node/SDNode";
import { BaseGraph } from "SD/Node/Graph/BaseGraph";

export class GridGraph extends BaseGraph {
    constructor(parent: SDNode);

    n(): number;
    n(n: number): this;
    m(): number;
    m(m: number): this;
    at(i: number, j: number): this;
}