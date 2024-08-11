import { BaseCurve }            from "@/Node/Curve/BaseCurve";
import { GetterAndSetter } from "@/Node/Common";

import { Vec }     from "@/Utility/Math";
import { PathPen } from "@/Utility/PathPen";

export function Brace(parent) {
    BaseCurve.call(this, parent);

    this.g().type("Brace");

    this.member.new("bending", 5);

    this.member.new("path-calculator", update);

    return this;
}

Brace.prototype = {
    ...BaseCurve.prototype
};

Brace.prototype.bending = GetterAndSetter("bending", "setByEqual");

function update() {
    if (!this.member.hasChanged("x1") &&
        !this.member.hasChanged("y1") &&
        !this.member.hasChanged("x2") &&
        !this.member.hasChanged("y2") &&
        !this.member.hasChanged("bending")) {
        return ["", false];
    }
    const vs = this.source();
    const vt = this.target();
    const vc = Vec.numberMul(Vec.add(vs, vt), 0.5)
    const d = Vec.numberMul(Vec.norm(Vec.sub(vt, vs)), this.member.get("bending"));
    const dl = Vec.rotate(d, -Math.PI/2);
    const p1 = Vec.add(vs, dl);
    const p2 = Vec.add(p1, d);
    const c2 = Vec.add(vc, dl);
    const c1 = Vec.sub(c2, d);
    const c3 = Vec.add(c2, d);
    const c = Vec.add(c2, dl);
    const p4 = Vec.add(vt, dl);
    const p3 = Vec.sub(p4, d);

    this.member.flush("x1");
    this.member.flush("y1");
    this.member.flush("x2");
    this.member.flush("y2");
    this.member.flush("bending");
    
    return [
        new PathPen().MoveTo(vs).Quad(p1, p2)
                     .LinkTo(c1).Quad(c2, c).Quad(c2, c3)
                     .LinkTo(p3).Quad(p4, vt)
                     .toString(),
        true
    ];
}