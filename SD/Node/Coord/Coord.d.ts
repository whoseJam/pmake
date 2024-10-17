import { SDNode } from "SD/Node/SDNode";

export class Coord extends SDNode {
    constructor(parent: SDNode);

    xAxis(): SDNode;
    yAxis(): SDNode;
}