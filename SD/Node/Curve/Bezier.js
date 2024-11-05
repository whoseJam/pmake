import { BaseCurve } from "@/Node/Curve/BaseCurve";

import { Vector as V } from "@/Math/Vector";

import { PathPen } from "@/Utility/PathPen";

export function Bezier(parent) {
    BaseCurve.call(this, parent);

    this.type("Bezier");
}

Bezier.prototype = {
    ...BaseCurve.prototype
};

Bezier.prototype.updateList = [
    update,
    ...Bezier.prototype.updateList
];

function update() {
    if (this.member.hasChanged("x1") ||
        this.member.hasChanged("y1") ||
        this.member.hasChanged("x2") ||
        this.member.hasChanged("y2")) {
        const v1 = this.source();
        const v2 = this.target();
        const d = V.sub(v2, v1);
        const d1q = V.numberMul(d, 0.25);
        const d3q = V.numberMul(d, 0.75);
        const pc1 = V.add(V.add(v1, d1q), V.rotate(d1q, Math.PI / 2));
        const pm = V.add(v1, V.numberMul(d, 0.5));
        const pc2 = V.add(V.add(v1, d3q), V.rotate(d1q, -Math.PI / 2));
        const pen = new PathPen().MoveTo(v1).Quad(pc1, pm).Quad(pc2, v2);
        this.member.set("d", pen.toString());
        this.member.flush("x1");
        this.member.flush("y1");
        this.member.flush("x2");
        this.member.flush("y2");
    }
}