import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";

export class Ellipse extends BaseNake {
    constructor(parent: SDNode);

    rx(): number;
    rx(rx: number): this;
    ry(): number;
    ry(ry: number): this;
}