import { Vector as V } from "@/Math/Vector";
import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { PathPen } from "@/Utility/PathPen";

const LOCATION_KEY = new Set(["l", "r", "t", "b"]);
const LOCATION_KEY_SUGGESTION: [() => boolean, string] = [
    () => true,
    "For ZZLine component, here are 4 types of locations which are 'l', 'r', 't', 'b'.",
];

export class ZZLine extends BaseCurve {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.type("ZZLine");

        this.vars.merge({
            bending: 0.25,
            location: "b",
        });

        this._.curve = (source: [number, number], target: [number, number]): string => {
            const s = source;
            const t = target;
            const bending = this.bending();
            const location = this.location();
            // index     - 变化量参考轴
            // index ^ 1 - 突起的轴
            const index = location === "l" || location === "r" ? 1 : 0;
            const sign = location === "l" || location === "t" ? -1 : 1;
            const distance = sign * (bending > 3 ? bending : Math.abs(s[index] - t[index]) * bending);
            // 中间点计算
            const operator = location === "l" || location === "t" ? "min" : "max";
            const d: [number, number] = index === 0 ? [0, distance] : [distance, 0];
            const ds = V.add(s, d);
            const dt = V.add(t, d);
            ds[index ^ 1] = dt[index ^ 1] = Math[operator](ds[index ^ 1], dt[index ^ 1]);
            const pen = new PathPen();
            pen.MoveTo(s).LineTo(ds).LineTo(dt).LineTo(t);
            return pen.toString();
        };

        this.effect("curve", () => {
            this.d(this._.curve(this.source(), this.target()));
        });
    }
    bending(): number;
    bending(bending: number): this;
    bending(bending?: number): number | this {
        if (arguments.length === 0) return this.vars.bending;
        Check.validateNumber(bending!, `${this.constructor.name}.bending`);
        this.vars.mpset("bending", bending!);
        return this;
    }
    location(): string;
    location(location: string): this;
    location(location?: string): string | this {
        if (arguments.length === 0) return this.vars.location;
        Check.validateLocation(location, LOCATION_KEY, `${this.constructor.name}.location`, 1, LOCATION_KEY_SUGGESTION);
        this.vars.location = location!;
        return this;
    }
}
