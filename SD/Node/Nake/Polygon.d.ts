import { SDNode }   from "@/Node/SDNode";
import { BaseNake } from "@/Node/Nake/BaseNake";

export class Polygon extends BaseNake {
    constructor(parent: SDNode);

    points(): [[number, number]];
    points(points: [[number, number]]): this;
}