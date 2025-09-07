import { Interp } from "@/Animate/Interp";
import { Vector as V } from "@/Math/Vector";
import { BasePath } from "@/Node/Path/BasePath";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

export class Line extends BasePath {
    constructor(target: SDNode | RenderNode, value?: any) {
        super(target);

        this._.nake = this.__createSVGNode("line");

        this.type("Line");

        this.vars.merge({
            x1: 0,
            y1: 0,
            x2: 40,
            y2: 40,
        });

        this._.nake.setAttribute("x1", this.vars.x1);
        this._.nake.setAttribute("y1", this.vars.y1);
        this._.nake.setAttribute("x2", this.vars.x2);
        this._.nake.setAttribute("y2", this.vars.y2);

        this.vars.watch("x1", Factory.action(this, this._.nake, "x1", Interp.numberInterp));
        this.vars.watch("y1", Factory.action(this, this._.nake, "y1", Interp.numberInterp));
        this.vars.watch("x2", Factory.action(this, this._.nake, "x2", Interp.numberInterp));
        this.vars.watch("y2", Factory.action(this, this._.nake, "y2", Interp.numberInterp));

        this.value(value);
    }
    x(): number;
    x(x: number): this;
    x(x?: number) {
        const x1 = this.x1();
        const x2 = this.x2();
        const ox = Math.min(x1, x2);
        if (x === undefined) return ox;
        const dx = x - ox;
        this.freeze();
        this.x1(x1 + dx);
        this.x2(x2 + dx);
        this.unfreeze();
        return this;
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        const y1 = this.y1();
        const y2 = this.y2();
        const oy = Math.min(y1, y2);
        if (y === undefined) return oy;
        const dy = y - oy;
        this.freeze();
        this.y1(y1 + dy);
        this.y2(y2 + dy);
        this.unfreeze();
        return this;
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        const x1 = this.x1();
        const x2 = this.x2();
        if (width === undefined) return Math.abs(x1 - x2);
        if (x1 < x2) this.x2(x1 + width);
        else this.x1(x2 + width);
        return this;
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        const y1 = this.y1();
        const y2 = this.y2();
        if (height === undefined) return Math.abs(y1 - y2);
        if (y1 < y2) this.y2(y1 + height);
        else this.y1(y2 + height);
        return this;
    }
    at(k: number) {
        const v1 = this.source();
        const v2 = this.target();
        const d = V.sub(v2, v1);
        return V.add(v1, V.numberMul(d, k));
    }
    getPointAtLength(length: number) {
        const total = this.totalLength();
        const k = length / total;
        return this.at(k);
    }
    totalLength() {
        const v1 = this.source();
        const v2 = this.target();
        return V.length(V.sub(v1, v2));
    }
    x1(): number;
    x1(x1: number): this;
    x1(x1?: number) {
        if (arguments.length === 0) return this.vars.x1;
        Check.validateNumber(x1, `${this.constructor.name}.x1`);
        this.vars.lpset("x1", x1);
        return this;
    }
    y1(): number;
    y1(y1: number): this;
    y1(y1?: number) {
        if (arguments.length === 0) return this.vars.y1;
        Check.validateNumber(y1, `${this.constructor.name}.y1`);
        this.vars.lpset("y1", y1);
        return this;
    }
    x2(): number;
    x2(x2: number): this;
    x2(x2?: number) {
        if (arguments.length === 0) return this.vars.x2;
        Check.validateNumber(x2, `${this.constructor.name}.x2`);
        this.vars.lpset("x2", x2);
        return this;
    }
    y2(): number;
    y2(y2: number): this;
    y2(y2?: number) {
        if (arguments.length === 0) return this.vars.y2;
        Check.validateNumber(y2, `${this.constructor.name}.y2`);
        this.vars.lpset("y2", y2);
        return this;
    }
    source(): [number, number];
    source(v: [number, number]): this;
    source(x: number, y: number): this;
    source(x?: number | [number, number], y?: number) {
        if (arguments.length === 0) return [this.x1(), this.y1()];
        if (Array.isArray(x)) return this.source(x[0], x[1]);
        this.freeze().x1(x).y1(y).unfreeze();
        return this;
    }
    target(): [number, number];
    target(v: [number, number]): this;
    target(x: number, y: number): this;
    target(x?: number | [number, number], y?: number) {
        if (arguments.length === 0) return [this.x2(), this.y2()];
        if (Array.isArray(x)) return this.target(x[0], x[1]);
        this.freeze().x2(x).y2(y).unfreeze();
        return this;
    }
}
