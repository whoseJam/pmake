import { Vec } from "../../Utility/Math";
import { BaseCurve } from "./BaseCurve";

export function Bezier(parent) {
    BaseCurve.call(this, parent);

    this.g().type("Bezier");

    return this;
}

Bezier.prototype = {
    ...BaseCurve.prototype
};

Bezier.prototype.pathCalculator = function() {
    const v1 = [this.x1(), this.y1()];
    const v2 = [this.x2(), this.y2()];
    const d = Vec.sub(v2, v1);
    const d1q = Vec.numberMul(d, 0.25);
    const d3q = Vec.numberMul(d, 0.75);
    const pc1 = Vec.add(Vec.add(v1, d1q), Vec.rotate(d1q, Math.PI / 2));
    const pm = Vec.add(v1, Vec.numberMul(d, 0.5));
    const pc2 = Vec.add(Vec.add(v1, d3q), Vec.rotate(d1q, -Math.PI / 2));
    return "M " + v1[0] + ", " + v1[1]
        + " Q " + pc1[0] + ", " + pc1[1] + ", " + pm[0] + ", " + pm[1]
        + " Q " + pc2[0] + ", " + pc2[1] + ", " + v2[0] + ", " + v2[1];
}
