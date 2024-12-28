import { Vector as V } from "@/Math/Vector";
import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { effect } from "@/Node/SDNode/SDValue";
import { Factory } from "@/Utility/Factory";
import { PathPen } from "@/Utility/PathPen";

export function BraceCurve(parent) {
    BaseCurve.call(this, parent);

    this.type("BraceCurve");

    this.vars.merge({
        bending: 5
    });

    this._.updater = effect(() => {
        const vs = this.source();
        const vt = this.target();
        const vc = V.numberMul(V.add(vs, vt), 0.5)
        const d = V.numberMul(V.norm(V.sub(vt, vs)), this.member.get("bending"));
        const dl = V.rotate(d, -Math.PI / 2);
        const p1 = V.add(vs, dl);
        const p2 = V.add(p1, d);
        const c2 = V.add(vc, dl);
        const c1 = V.sub(c2, d);
        const c3 = V.add(c2, d);
        const c = V.add(c2, dl);
        const p4 = V.add(vt, dl);
        const p3 = V.sub(p4, d);
        const pen = new PathPen().MoveTo(vs).Quad(p1, p2)
            .LinkTo(c1).Quad(c2, c).Quad(c2, c3)
            .LinkTo(p3).Quad(p4, vt);
        this.d(pen.toString());
    });
}

BraceCurve.prototype = {
    ...BaseCurve.prototype
};

BraceCurve.prototype.bending = Factory.handlerMediumPrecise("bending");
