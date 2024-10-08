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
        const v1 = this.source();
        const v2 = this.target();
        const d = Vector.sub(v2, v1);
        const d1q = Vector.numberMul(d, 0.25);
        const d3q = Vector.numberMul(d, 0.75);
        const pc1 = Vector.add(Vector.add(v1, d1q), Vector.rotate(d1q, Math.PI / 2));
        const pm = Vector.add(v1, Vector.numberMul(d, 0.5));
        const pc2 = Vector.add(Vector.add(v1, d3q), Vector.rotate(d1q, -Math.PI / 2));       
        const pen = new PathPen().MoveTo(v1).Quad(pc1, pm).Quad(pc2, v2);
        this.member.set("d", pen.toString());
        this.member.flush("x1");
        this.member.flush("y1");
        this.member.flush("x2");
        this.member.flush("y2");
    }
}