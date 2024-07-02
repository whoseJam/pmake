import { D3Layer } from "../D3Layer";
import { SDNode } from "../SDNode";
import { CurveBase } from "./CurveBase";
import { equal } from "@/Utility/Math";

/**
 * @class CircleCurve
 */
export class CircleCurve extends CurveBase {
    /**
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) { 
        super(node);
        this.g().type("CircleCurve");
        this._.r = 20;
    }

    /**
     * @overload
     * @param {number} r 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    r(r) {
        if (r === undefined) return this._.r;
        if (equal(r, this._.r)) return this;
        this._.r = r;
        this.dirty(this, "U");
        return this;
    }

    pathCalculator() {
        const r = this._.r;
        const x1 = this.x1(), y1 = this.y1();
        const x2 = this.x2(), y2 = this.y2();
        if (x1 === x2 && y1 === y2) x2++;
        return `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`;
    }
}