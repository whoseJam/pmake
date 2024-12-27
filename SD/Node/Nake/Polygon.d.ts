import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";

export class Polygon extends BaseNake {
    constructor(parent: SDNode);

    points(): [[number, number]];
    points(points: [[number, number]]): this;
}