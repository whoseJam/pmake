import { SDNode }      from "@/Node/SDNode";
import { BaseElement } from "@/Node/Element/BaseElement";

export class Vertex extends BaseElement {
    constructor(parent: SDNode);

    r(): number;
    r(r: number): this;
}