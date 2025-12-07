import { BaseShape } from "@/Node/Shape/BaseShape";
import { SDNode } from "@/Node/SDNode";

export class Rect extends BaseShape {
    constructor(args?: {
        targetNode?: SDNode;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        rx?: number;
        ry?: number;
    }) {
        super();

        this.__createSVGNode("rect", {
            x: args?.x ?? 0,
            y: args?.y ?? 0,
            width: args?.width ?? 40,
            height: args?.height ?? 40,
            rx: args?.rx ?? 0,
            ry: args?.ry ?? 0,
        });

        this.setType("Rect");

        args?.targetNode?.appendChild(this);
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

    setCenterX(cx: number) {
        return this.setX(this.getX() + cx - this.getCenterX());
    }

    setCenterY(cy: number) {
        return this.setY(this.getY() + cy - this.getCenterY());
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
