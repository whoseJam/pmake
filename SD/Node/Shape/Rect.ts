import { BaseShape } from "@/Node/Shape/BaseShape";

export class Rect extends BaseShape {
    constructor() {
        super();

        this.__createSVGNode("rect", {
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            rx: 0,
            ry: 0,
        });

        this.setType("Rect");
    }
    getX(): number {
        return this.vars.x;
    }
    setX(x: number): this {
        this.vars.lpset("x", x);
        return this;
    }
    getY(): number {
        return this.vars.y;
    }
    setY(y: number): this {
        this.vars.lpset("y", y);
        return this;
    }
    getWidth(): number {
        return this.vars.width;
    }
    setWidth(width: number) {
        this.vars.lpset("width", width);
        return this;
    }
    getHeight(): number {
        return this.vars.height;
    }
    setHeight(height: number) {
        this.vars.lpset("height", height);
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
    setBorderRadius(r: number): this {
        return this.setRX(r).setRY(r);
    }
}
