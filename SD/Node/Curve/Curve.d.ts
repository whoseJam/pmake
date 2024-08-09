import { SDNode }    from "SD/Node/SDNode";
import { D3Layer }   from "SD/Node/D3Layer";
import { BaseCurve } from "SD/Node/Curve/BaseCurve";

export class Curve extends BaseCurve {
    constructor(parent: SDNode|D3Layer);

    bending(): number;
    bending(bending: number): this;
}