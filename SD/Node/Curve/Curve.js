import { SDNode }    from "@/Node/SDNode";
import { BaseCurve } from "@/Node/Curve/BaseCurve";

import { Vector } from "@/Math/Vector";
import { PathPen } from "@/Utility/PathPen";

export function Curve(parent) {
    BaseCurve.call(this, parent);

    this.type("Curve");

    this.member.new("bending", 0.25);

    this.member.new("path-calculator", update);

    return this;
}

Curve.prototype = {
    ...BaseCurve.prototype
};

Curve.prototype.bending = SDNode.OrdinaryGSet("bending", "setByDqual");

function update() {
    if (!this.member.hasChanged("x1") &&
        !this.member.hasChanged("y1") &&
        !this.member.hasChanged("x2") &&
        !this.member.hasChanged("y2") &&
        !this.member.hasChanged("bending")) {
        return ["", false];
    }
    const v1 = this.source();
    const v2 = this.target();
    const d = Vector.sub(v2, v1);
    const dis = Vector.length(d);
    const left = Vector.norm(Vector.rotate(d, Math.PI / 2));
    const vc = Vector.add(
        Vector.add(v1, Vector.numberMul(d, 0.5)),
        Vector.numberMul(left, dis * this.member.get("bending"))
    );
    return [
        new PathPen().MoveTo(v1).Quad(vc, v2).toString(),
        true
    ];
}