import { SDNode }   from "@/Node/SDNode";
import { BaseNake } from "@/Node/Nake/BaseNake";

export class Circle extends BaseNake {
    constructor(parent: SDNode);

    r(): number;
    r(r: number): this;
}