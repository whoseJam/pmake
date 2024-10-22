import { BaseCurve } from "@/Node/Curve/BaseCurve";

import { Vector } from "@/Math/Vector";

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
        const vector = Vector.getIns();
        const v1 = this.source();
        const v2 = this.target();
        const d = vector.sub(v2, v1);
        const d1q = vector.numberMul(d, 0.25);
        const d3q = vector.numberMul(d, 0.75);
        const pc1 = vector.add(vector.add(v1, d1q), vector.rotate(d1q, Math.PI / 2));
        const pm = vector.add(v1, vector.numberMul(d, 0.5));
        const pc2 = vector.add(vector.add(v1, d3q), vector.rotate(d1q, -Math.PI / 2));       
        const pen = new PathPen().MoveTo(v1).Quad(pc1, pm).Quad(pc2, v2);
        this.member.set("d", pen.toString());
        this.member.flush("x1");
        this.member.flush("y1");
        this.member.flush("x2");
        this.member.flush("y2");
    }
}