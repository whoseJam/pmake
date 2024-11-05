import { SDNode }    from "@/Node/SDNode";
import { BaseCurve } from "@/Node/Curve/BaseCurve";

export class ZZLine extends BaseCurve {
    constructor(parent: SDNode);

    bending(): number;
    bending(bending: number): this;
    location(): "t"|"b"|"l"|"r";
    location(location: "t"|"b"|"l"|"r"): this;
}