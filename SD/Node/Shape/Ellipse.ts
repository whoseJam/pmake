import { SDNode } from "@/Node/SDNode";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { Circle } from "@/Node/Shape/Circle";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

export class Ellipse extends BaseShape {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.__createSVGNode("ellipse", {
            rx: 20,
            ry: 20,
            cx: 20,
            cy: 20,
        });

        this.type("Ellipse");
    }
    cx(): number;
    cx(cx: number): this;
    cx(cx?: number) {
        if (arguments.length === 0) return Circle.prototype.cx.call(this);
        return Circle.prototype.cx.call(this, cx);
    }
    cy(): number;
    cy(cy: number): this;
    cy(cy?: number) {
        if (arguments.length === 0) return Circle.prototype.cy.call(this);
        return Circle.prototype.cy.call(this, cy);
    }
    rx(): number;
    rx(rx: number): this;
    rx(rx?: number) {
        if (arguments.length === 0) return this.vars.rx;
        Check.validateNumber(rx, `${this.constructor.name}.rx`);
        this.vars.lpset("rx", rx);
        return this;
    }
    ry(): number;
    ry(ry: number): this;
    ry(ry?: number) {
        if (arguments.length === 0) return this.vars.ry;
        Check.validateNumber(ry, `${this.constructor.name}.ry`);
        this.vars.lpset("ry", ry);
        return this;
    }
    x(): number;
    x(x: number): this;
    x(x?: number) {
        if (x === undefined) return this.cx() - this.rx();
        return this.cx(x - this.x() + this.cx());
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        if (y === undefined) return this.cy() - this.ry();
        return this.cy(y - this.y() + this.cy());
    }
}
