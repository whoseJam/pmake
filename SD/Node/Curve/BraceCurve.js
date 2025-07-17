import { Vector as V } from "@/Math/Vector";
import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { Check } from "@/Utility/Check";
import { PathPen } from "@/Utility/PathPen";

export class BraceCurve extends BaseCurve {
    constructor(target) {
        super(target);

        this.type("BraceCurve");

        this.vars.merge({
            bending: 5,
        });

        this._.curve = (source, target) => {
            const vs = source;
            const vt = target;
            const vc = V.numberMul(V.add(vs, vt), 0.5);
            const d = V.numberMul(V.norm(V.sub(vt, vs)), this.bending());
            const dl = V.rotate(d, -Math.PI / 2);
            const p1 = V.add(vs, dl);
            const p2 = V.add(p1, d);
            const c2 = V.add(vc, dl);
            const c1 = V.sub(c2, d);
            const c3 = V.add(c2, d);
            const c = V.add(c2, dl);
            const p4 = V.add(vt, dl);
            const p3 = V.sub(p4, d);
            const pen = new PathPen();
            pen.MoveTo(vs).Quad(p1, p2);
            pen.LinkTo(c1).Quad(c2, c).Quad(c2, c3);
            pen.LinkTo(p3).Quad(p4, vt);
            return pen.toString();
        };

        this.effect("curve", () => {
            this.d(this._.curve(this.source(), this.target()));
        });
    }
}

Object.assign(BraceCurve.prototype, {
    bending(bending) {
        if (arguments.length === 0) return this.vars.bending;
        Check.validateNumber(bending, `${this.constructor.name}.bending`);
        this.vars.lpset("bending", bending);
        return this;
    },
});
