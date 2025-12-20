import { BaseShape } from "@/Node/Shape/BaseShape";

export class Image extends BaseShape {
    constructor() {
        super();

        this.setType("Image");

        this.__createSVGNode("image", {
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            src: "",
            preserveAspectRatio: "xMidYMid meet",
        });
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
    getSrc(): string {
        return this.vars.src;
    }
    setSrc(src: string): this {
        this.vars.src = src;
        return this;
    }
}
