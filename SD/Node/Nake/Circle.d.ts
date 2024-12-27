import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";

export class Circle extends BaseNake {
    constructor(parent: SDNode);

    r(): number;
    r(r: number): this;
}