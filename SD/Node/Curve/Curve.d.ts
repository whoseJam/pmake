import { SDNode }    from "SD/Node/SDNode";
import { BaseCurve } from "SD/Node/Curve/BaseCurve";

export class Curve extends BaseCurve {
    constructor(parent: SDNode);

    bending(): number;
    bending(bending: number): this;
}