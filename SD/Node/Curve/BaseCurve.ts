import { Vector as V } from "@/Math/Vector";
import { Path } from "@/Node/Path/Path";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

export class BaseCurve extends Path {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.vars.merge({
            x1: 0,
            y1: 0,
            x2: 40,
            y2: 40,
        });
    }
    x1(): number;
    x1(x1: number): this;
    x1(x1?: number): number | this {
        if (arguments.length === 0) return this.vars.x1;
        Check.validateNumber(x1, `${this.constructor.name}.x1`);
        this.vars.lpset("x1", x1);
        return this;
    }
    y1(): number;
    y1(y1: number): this;
    y1(y1?: number): number | this {
        if (arguments.length === 0) return this.vars.y1;
        Check.validateNumber(y1, `${this.constructor.name}.y1`);
        this.vars.lpset("y1", y1);
        return this;
    }
    x2(): number;
    x2(x2: number): this;
    x2(x2?: number): number | this {
        if (arguments.length === 0) return this.vars.x2;
        Check.validateNumber(x2, `${this.constructor.name}.x2`);
        this.vars.lpset("x2", x2);
        return this;
    }
    y2(): number;
    y2(y2: number): this;
    y2(y2?: number): number | this {
        if (arguments.length === 0) return this.vars.y2;
        Check.validateNumber(y2, `${this.constructor.name}.y2`);
        this.vars.lpset("y2", y2);
        return this;
    }
    source(): [number, number];
    source(point: [number, number]): this;
    source(x: number, y: number): this;
    source(x?: number | [number, number], y?: number): [number, number] | this {
        if (arguments.length === 0) {
            return [this.x1(), this.y1()];
        } else if (arguments.length === 1) {
            const point = x as [number, number];
            return this.source(point[0], point[1]);
        }
        this.freeze()
            .x1(x as number)
            .y1(y as number)
            .unfreeze();
        return this;
    }
    target(): [number, number];
    target(point: [number, number]): this;
    target(x: number, y: number): this;
    target(x?: number | [number, number], y?: number): [number, number] | this {
        if (arguments.length === 0) {
            return [this.x2(), this.y2()];
        } else if (arguments.length === 1) {
            const point = x as [number, number];
            return this.target(point[0], point[1]);
        }
        this.freeze()
            .x2(x as number)
            .y2(y as number)
            .unfreeze();
        return this;
    }
    dx(dx: number): this {
        this.freeze();
        this.source(V.add(this.source(), [dx, 0]));
        this.target(V.add(this.target(), [dx, 0]));
        this.unfreeze();
        return this;
    }
    dy(dy: number): this {
        this.freeze();
        this.source(V.add(this.source(), [0, dy]));
        this.target(V.add(this.target(), [0, dy]));
        this.unfreeze();
        return this;
    }
}
