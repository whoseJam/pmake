import { SDNode }    from "@/Node/SDNode";
import { BaseCurve } from "@/Node/Curve/BaseCurve";

export class BraceCurve extends BaseCurve {
    constructor(parent: SDNode);

    bending(): number;
    bending(bending: number): this;
}