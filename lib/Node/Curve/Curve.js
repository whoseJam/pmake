import { CurveBase } from "./CurveBase";
import { D3Layer } from "../D3Layer";
import { equal } from "@/Utility/Math";
import { SDNode } from "../Node";
import { Vec } from "@/Utility/Math";

/**
 * @class Curve
 */
export class Curve extends CurveBase {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this.g().type("Curve");
        this._.bending = 0.25;
    }

    /**
     * @overload
     * @param {number} bending 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    bending(bending) {
        this.dirtyCheck("m");
        if (bending === undefined) return this._.bending;
        if (equal(bending, this._.bending)) return this;
        this._.bending = bending;
        this.dirty(this, "U");
        return this;
    }

    pathCalculator() {
        const v1 = [this.x1(), this.y1()];
        const v2 = [this.x2(), this.y2()];
        const d = Vec.sub(v2, v1);
        const dis = Vec.length(d);
        const left = Vec.norm(Vec.rotate(d, Math.PI / 2));
        const vc = Vec.add(
            Vec.add(v1, Vec.numberMul(d, 0.5)),
            Vec.numberMul(left, dis * this._.bending)
        );
        const pathString = `M ${v1[0]}, ${v1[1]} Q ${vc[0]}, ${vc[1]}, ${v2[0]}, ${v2[1]}`;
        return pathString;
    }
}