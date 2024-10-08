import { BaseCurve } from "@/Node/Curve/BaseCurve";

import { Vector } from "@/Math/Vector";
import { PathPen } from "@/Utility/PathPen";

export function VHBezier(parent) {
    BaseCurve.call(this, parent);

    this.type("VHBezier");
}

VHBezier.prototype = {
    ...BaseCurve.prototype
};

VHBezier.prototype.updateList = [
    update,
    ...VHBezier.prototype.updateList
];

function update() {
    if (this.member.hasChanged("x1") ||
        this.member.hasChanged("y1") ||
        this.member.hasChanged("x2") ||
        this.member.hasChanged("y2")) {
        const v1 = [this.x1(), this.y1()];
        const v2 = [this.x2(), this.y2()];
        let d = Vector.sub(v2, v1), p1, p2, pm;
        pm = Vector.add(v1, Vector.numberMul(d, 0.5));
        if (d[0] < d[1]) {
            p1 = [v1[0], v1[1] + d[1] * 0.5];
            p2 = [v2[0], v2[1] - d[1] * 0.5];
        } else {
            p1 = [v1[0] + d[0] * 0.5, v1[1]];
            p2 = [v2[0] - d[0] * 0.5, v2[1]];
        }
        const pen = new PathPen().MoveTo(v1).Quad(p1, pm).Quad(p2, v2);
        this.member.set("d", pen.toString());
        this.member.flush("x1");
        this.member.flush("y1");
        this.member.flush("x2");
        this.member.flush("y2");
    }
    // return "M " + v1[0] + ", " + v1[1]
    //     + " Q " + p1[0] + ", " + p1[1] + ", " + pm[0] + ", " + pm[1]
    //     + " Q " + p2[0] + ", " + p2[1] + ", " + v2[0] + ", " + v2[1];
}