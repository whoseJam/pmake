import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";

export class BraceCurve extends BaseCurve {
    constructor(parent: SDNode);

    bending(): number;
    bending(bending: number): this;
}