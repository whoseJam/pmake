import { SDNode }      from "SD/Node/SDNode";
import { BaseElement } from "SD/Node/Element/BaseElement";

export class Vertex extends BaseElement {
    constructor(parent: SDNode);

    r(): number;
    r(r: number): this;
}