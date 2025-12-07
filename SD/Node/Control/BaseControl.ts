import { SDHTMLNode } from "@/Node/SDHTMLNode";

export class BaseControl extends SDHTMLNode {
    constructor() {
        super();
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

    setWidth(width: number): this {
        this.vars.lpset("width", width);
        return this;
    }

    getHeight(): number {
        return this.vars.height;
    }

    setHeight(height: number): this {
        this.vars.lpset("height", height);
        return this;
    }
}
