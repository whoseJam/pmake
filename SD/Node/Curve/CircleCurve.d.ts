import { SDNode }    from "@/Node/SDNode";
import { BaseCurve } from "@/Node/Curve/BaseCurve";

export class CircleCurve extends BaseCurve {
    constructor(parent: SDNode);

    r(): number;
    r(r: number): this;
}