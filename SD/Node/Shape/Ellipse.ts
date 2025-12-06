import { BaseShape } from "@/Node/Shape/BaseShape";

export class Ellipse extends BaseShape {
    constructor() {
        super();

        this.__createSVGNode("ellipse", {
            rx: 20,
            ry: 20,
            cx: 20,
            cy: 20,
        });

        this.setType("Ellipse");
    }
    getX() {
        return this.getCenterX() - this.getRX();
    }
    getY() {
        return this.getCenterY() - this.getRY();
    }
    getWidth() {
        return this.getRX() * 2;
    }
    getHeight() {
        return this.getRY() * 2;
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
    getRX(): number {
        return this.vars.rx;
    }
    setRX(rx: number): this {
        this.vars.lpset("rx", rx);
        return this;
    }
    getRY(): number {
        return this.vars.ry;
    }
    setRY(ry: number): this {
        this.vars.lpset("ry", ry);
        return this;
    }
}
