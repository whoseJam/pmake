import { Vector as V } from "@/Math/Vector";
import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { Check } from "@/Utility/Check";
import { PathPen } from "@/Utility/PathPen";

export class Curve extends BaseCurve {
    constructor(target) {
        super(target);

        this.type("Curve");

        this.vars.merge({
            bending: 0.25,
        });

        this._.curve = (source, target) => {
            const v1 = source;
            const v2 = target;
            const d = V.sub(v2, v1);
            const dis = V.length(d);
            const left = V.norm(V.rotate(d, Math.PI / 2));
            const vc = V.add(V.add(v1, V.numberMul(d, 0.5)), V.numberMul(left, dis * this.bending()));
            const pen = new PathPen().MoveTo(v1).Quad(vc, v2);
            return pen.toString();
        };

        this.effect("curve", () => {
            this.d(this._.curve(this.source(), this.target()));
        });
    }
}

Object.assign(Curve.prototype, {
    bending(bending) {
        if (arguments.length === 0) return this.vars.bending;
        Check.validateNumber(bending, `${this.constructor.name}.bending`);
        this.vars.mpset("bending", bending);
        return this;
    },
});
