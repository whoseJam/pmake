import { SDNode } from "SD/Node/SDNode";

export class Coord extends SDNode {
    constructor(parent: SDNode);

    xAxis(): SDNode;
    yAxis(): SDNode;

    viewX(): number;
    viewX(x: number): this;
    viewY(): number;
    viewY(y: number): this;
    viewWidth(): number;
    viewWidth(width: number): this;
    viewHeight(): number;
    viewHeight(height: number): this;

    at(x: number, y: number): [number, number];
    at(vec: [number, number]): [number, number];
}