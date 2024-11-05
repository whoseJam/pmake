import { SDNode }    from "@/Node/SDNode";
import { BaseCurve } from "@/Node/Curve/BaseCurve";

import { Vector as V } from "@/Math/Vector"
;
import { PathPen } from "@/Utility/PathPen";

export function Curve(parent) {
    BaseCurve.call(this, parent);

    this.type("Curve");

    this.member.new("bending", 0.25);
}

Curve.prototype = {
    ...BaseCurve.prototype
};

Curve.prototype.bending = SDNode.OrdinaryGSet("bending", "setByDqual");

Curve.prototype.updateList = [
    update,
    ...Curve.prototype.updateList
];

function update() {
    if (this.member.hasChanged("x1") ||
        this.member.hasChanged("y1") ||
        this.member.hasChanged("x2") ||
        this.member.hasChanged("y2") ||
        this.member.hasChanged("bending")) {
        const v1 = this.source();
        const v2 = this.target();
        const d = V.sub(v2, v1);
        const dis = V.length(d);
        const left = V.norm(V.rotate(d, Math.PI / 2));
        const vc = V.add(
            V.add(v1, V.numberMul(d, 0.5)),
            V.numberMul(left, dis * this.member.get("bending"))
        );
        const pen = new PathPen().MoveTo(v1).Quad(vc, v2);
        this.member.set("d", pen.toString());
        this.member.flush("x1");
        this.member.flush("y1");
        this.member.flush("x2");
        this.member.flush("y2");
        this.member.flush("bending");
    }
}