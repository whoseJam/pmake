import { CurveBase } from "./CurveBase";
import { Vec } from "../../Utility/Math";

export class Bezier extends CurveBase {
    constructor(node) {
        super(node);
        this.g().attr("type", "Bezier");
    }

    pathCalculator() {
        let v1 = [this.x1(), this.y1()];
        let v2 = [this.x2(), this.y2()];
        let d = Vec.sub(v2, v1);
        let d1q = Vec.numberMul(d, 0.25);
        let d3q = Vec.numberMul(d, 0.75);
        let pc1 = Vec.add(Vec.add(v1, d1q), Vec.rotate(d1q, Math.PI / 2));
        let pm = Vec.add(v1, Vec.numberMul(d, 0.5));
        let pc2 = Vec.add(Vec.add(v1, d3q), Vec.rotate(d1q, -Math.PI / 2));
        return "M " + v1[0] + ", " + v1[1]
            + " Q " + pc1[0] + ", " + pc1[1] + ", " + pm[0] + ", " + pm[1]
            + " Q " + pc2[0] + ", " + pc2[1] + ", " + v2[0] + ", " + v2[1];
    }
}
