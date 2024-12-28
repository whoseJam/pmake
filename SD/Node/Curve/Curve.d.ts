import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";

export class Curve extends BaseCurve {
    constructor(parent: SDNode);

    bending(): number;
    bending(bending: number): this;
}