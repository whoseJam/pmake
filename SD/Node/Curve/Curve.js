import { BaseCurve }            from "@/Node/Curve/BaseCurve";
import { GetterAndSetter } from "@/Node/Common";

import { Vec }     from "@/Utility/Math";
import { PathPen } from "@/Utility/PathPen";

export function Curve(parent) {
    BaseCurve.call(this, parent);

    this.g().type("Curve");

    this.member.new("bending", 0.25);

    this.member.new("path-calculator", update);

    return this;
}

Curve.prototype = {
    ...BaseCurve.prototype
};

Curve.prototype.bending = GetterAndSetter("bending", "setByDqual");

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
    const d = Vec.sub(v2, v1);
    const dis = Vec.length(d);
    const left = Vec.norm(Vec.rotate(d, Math.PI / 2));
    const vc = Vec.add(
        Vec.add(v1, Vec.numberMul(d, 0.5)),
        Vec.numberMul(left, dis * this.member.get("bending"))
    );
    return [
        new PathPen().MoveTo(v1).Quad(vc, v2).toString(),
        true
    ];
}