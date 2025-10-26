import { Vector as V } from "@/Math/Vector";
import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { PathPen } from "@/Utility/PathPen";

export class VHBezier extends BaseCurve {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("VHBezier");

        this._.curve = (source: [number, number], target: [number, number]): string => {
            const v1 = source;
            const v2 = target;
            let d = V.sub(v2, v1);
            let p1: [number, number];
            let p2: [number, number];
            let pm: [number, number];
            pm = V.add(v1, V.numberMul(d, 0.5));
            if (d[0] < d[1]) {
                p1 = [v1[0], v1[1] + d[1] * 0.5];
                p2 = [v2[0], v2[1] - d[1] * 0.5];
            } else {
                p1 = [v1[0] + d[0] * 0.5, v1[1]];
                p2 = [v2[0] - d[0] * 0.5, v2[1]];
            }
            const pen = new PathPen().MoveTo(v1).Quad(p1, pm).Quad(p2, v2);
            return pen.toString();
        };

        this.effect("curve", () => {
            this.d(this._.curve(this.source(), this.target()));
        });
    }
}
