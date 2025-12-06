import { BaseShape } from "@/Node/Shape/BaseShape";

export class Circle extends BaseShape {
    constructor() {
        super();

        this.__createSVGNode("circle", {
            cx: 20,
            cy: 20,
            r: 20,
        });

        this.setType("Circle");
    }
    getCenterX(): number {
        return this.vars.cx;
    }
    setCenterX(cx: number): this {
        this.vars.lpset("cx", cx);
        return this;
    }
    getCenterY(): number {
        return this.vars.cy;
    }
    setCenterY(cy: number): this {
        this.vars.lpset("cy", cy);
        return this;
    }
    getR(): number {
        return this.vars.r;
    }
    setR(r: number): this {
        this.vars.lpset("r", r);
        return this;
    }
    getX(): number {
        return this.getCenterX() - this.getR();
    }
    getY(): number {
        return this.getCenterY() - this.getR();
    }
    getWidth(): number {
        return this.getR() * 2;
    }
    getHeight(): number {
        return this.getR() * 2;
    }
}
