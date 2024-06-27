import { CurveBase } from "./CurveBase";
import { Vec } from "../../Utility/Math";
import { SDNode } from "../Node";
import { D3Layer } from "../D3Layer";

/**
 * @class VHBezier
 */
export class VHBezier extends CurveBase {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this.g().type("VHBezier");
    }

    pathCalculator() {
        const v1 = [this.x1(), this.y1()];
        const v2 = [this.x2(), this.y2()];
        let d = Vec.sub(v2, v1), p1, p2, pm;
        pm = Vec.add(v1, Vec.numberMul(d, 0.5));
        if (d[0] < d[1]) {
            p1 = [v1[0], v1[1] + d[1] * 0.5];
            p2 = [v2[0], v2[1] - d[1] * 0.5];
        } else {
            p1 = [v1[0] + d[0] * 0.5, v1[1]];
            p2 = [v2[0] - d[0] * 0.5, v2[1]];
        }
        return "M " + v1[0] + ", " + v1[1]
            + " Q " + p1[0] + ", " + p1[1] + ", " + pm[0] + ", " + pm[1]
            + " Q " + p2[0] + ", " + p2[1] + ", " + v2[0] + ", " + v2[1];
    }
}