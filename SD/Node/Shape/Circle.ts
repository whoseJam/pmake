import { SDNode } from "@/Node/SDNode";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

export class Circle extends BaseShape {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this._.nake = this.__createSVGNode("circle", {
            cx: 20,
            cy: 20,
            r: 20,
        });

        this.type("Circle");
    }
    cx(): number;
    cx(cx: number): this;
    cx(cx?: number) {
        if (arguments.length === 0) return this.vars.cx;
        Check.validateNumber(cx, `${this.constructor.name}.cx`);
        this.vars.lpset("cx", cx);
        return this;
    }
    cy(): number;
    cy(cy: number): this;
    cy(cy?: number) {
        if (arguments.length === 0) return this.vars.cy;
        Check.validateNumber(cy, `${this.constructor.name}.cy`);
        this.vars.lpset("cy", cy);
        return this;
    }
    r(): number;
    r(r: number): this;
    r(r?: number) {
        if (arguments.length === 0) return this.vars.r;
        Check.validateNumber(r, `${this.constructor.name}.r`);
        this.vars.lpset("r", r);
        return this;
    }
    x(): number;
    x(x: number): this;
    x(x?: number) {
        if (x === undefined) return this.cx() - this.r();
        return this.cx(x - this.x() + this.cx());
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        if (y === undefined) return this.cy() - this.r();
        return this.cy(y - this.y() + this.cy());
    }
}
