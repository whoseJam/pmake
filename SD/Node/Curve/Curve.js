import { Vec }     from "@/Utility/Math";
import { PathPen } from "@/Utility/PathPen";

import { BaseCurve }            from "@/Node/Curve/BaseCurve";
import { naiveGetterAndSetter } from "@/Node/Common";

export function Curve(parent) {
    BaseCurve.call(this, parent);

    this.g().type("Curve");

    this.member.new("bending", 0.25);

    return this;
}

Curve.prototype = {
    ...BaseCurve.prototype
};

Curve.prototype.bending = naiveGetterAndSetter("bending", "setByDqual");

Curve.prototype.pathCalculator = function() {
    const v1 = [this.x1(), this.y1()];
    const v2 = [this.x2(), this.y2()];
    const d = Vec.sub(v2, v1);
    const dis = Vec.length(d);
    const left = Vec.norm(Vec.rotate(d, Math.PI / 2));
    const vc = Vec.add(
        Vec.add(v1, Vec.numberMul(d, 0.5)),
        Vec.numberMul(left, dis * this.member.get("bending"))
    );
    return new PathPen().MoveTo(v1).Quad(vc, v2).toString();
}