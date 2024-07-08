import { BaseCurve } from "./BaseCurve";

export class Curve extends BaseCurve {
    constructor(parent: any);

    bending(): number;
    bending(bending: number): this;
}