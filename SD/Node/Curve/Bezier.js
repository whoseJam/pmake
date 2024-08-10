import { BaseCurve } from "@/Node/Curve/BaseCurve";

import { Vec }     from "@/Utility/Math";
import { PathPen } from "@/Utility/PathPen";

export function Bezier(parent) {
    BaseCurve.call(this, parent);

    this.g().type("Bezier");

    this.member.new("path-calculator", update);

    return this;
}

Bezier.prototype = {
    ...BaseCurve.prototype
};

function update() {
    if (!this.member.hasChanged("x1") &&
        !this.member.hasChanged("y1") &&
        !this.member.hasChanged("x2") &&
        !this.member.hasChanged("y2")) {
        return ["", false];
    }
    const v1 = this.source();
    const v2 = this.target();
    const d = Vec.sub(v2, v1);
    const d1q = Vec.numberMul(d, 0.25);
    const d3q = Vec.numberMul(d, 0.75);
    const pc1 = Vec.add(Vec.add(v1, d1q), Vec.rotate(d1q, Math.PI / 2));
    const pm = Vec.add(v1, Vec.numberMul(d, 0.5));
    const pc2 = Vec.add(Vec.add(v1, d3q), Vec.rotate(d1q, -Math.PI / 2));
    return [
        new PathPen().MoveTo(v1).Quad(pc1, pm).Quad(pc2, v2)
                     .toString(),
        true
    ];
}