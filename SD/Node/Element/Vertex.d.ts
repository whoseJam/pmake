import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";

export class Vertex extends BaseElement {
    constructor(parent: SDNode);

    r(): number;
    r(r: number): this;
}