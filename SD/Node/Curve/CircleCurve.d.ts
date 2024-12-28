import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";

export class CircleCurve extends BaseCurve {
    constructor(parent: SDNode);

    r(): number;
    r(r: number): this;
}