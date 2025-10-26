import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { PathPen } from "@/Utility/PathPen";

export class CircleCurve extends BaseCurve {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("CircleCurve");

        this.vars.merge({
            r: 20,
        });

        this._.curve = (source: [number, number], target: [number, number]): string => {
            const r = this.r();
            const x1 = source[0];
            const y1 = source[1];
            let x2 = target[0];
            const y2 = target[1];
            if (x1 === x2 && y1 === y2) x2++;
            const pen = new PathPen().MoveTo(x1, y1).Arc(r, r, 0, 1, 1, x2, y2);
            return pen.toString();
        };

        this.effect("curve", () => {
            this.d(this._.curve(this.source(), this.target()));
        });
    }
    r(): number;
    r(r: number): this;
    r(r?: number): number | this {
        if (arguments.length === 0) return this.vars.r;
        Check.validateNumber(r!, `${this.constructor.name}.r`);
        this.vars.lpset("r", r!);
        return this;
    }
}
