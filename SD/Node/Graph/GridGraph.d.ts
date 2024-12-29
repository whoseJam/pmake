import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { SDNode } from "@/Node/SDNode";

export class GridGraph extends BaseGraph {
    constructor(parent: SDNode);

    n(): number;
    n(n: number): this;
    m(): number;
    m(m: number): this;
    at(i: number, j: number): this;
}