import { SDNode }    from "@/Node/SDNode";
import { BaseCurve } from "@/Node/Curve/BaseCurve";

import { Vector } from "@/Math/Vector";

import { PathPen } from "@/Utility/PathPen";

export function BraceCurve(parent) {
    BaseCurve.call(this, parent);

    this.type("BraceCurve");

    this.member.new("bending", 5);

    this.member.new("path-calculator", update);

    return this;
}

BraceCurve.prototype = {
    ...BaseCurve.prototype
};

BraceCurve.prototype.bending = SDNode.OrdinaryGSet("bending", "setByEqual");

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
    const vc = Vector.numberMul(Vector.add(vs, vt), 0.5)
    const d = Vector.numberMul(Vector.norm(Vector.sub(vt, vs)), this.member.get("bending"));
    const dl = Vector.rotate(d, -Math.PI/2);
    const p1 = Vector.add(vs, dl);
    const p2 = Vector.add(p1, d);
    const c2 = Vector.add(vc, dl);
    const c1 = Vector.sub(c2, d);
    const c3 = Vector.add(c2, d);
    const c = Vector.add(c2, dl);
    const p4 = Vector.add(vt, dl);
    const p3 = Vector.sub(p4, d);

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