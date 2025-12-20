import { BaseShape } from "@/Node/Shape/BaseShape";
import { SDNode } from "@/Node/SDNode";
import { SDColor, Color as C } from "@/Utility/Color";

export class Rect extends BaseShape {
    constructor(args?: {
        targetNode?: SDNode;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        rx?: number;
        ry?: number;
        fill?: SDColor;
        fillOpacity?: number;
        stroke?: SDColor;
        strokeOpacity?: number;
        strokeWidth?: number;
        strokeDashOffset?: number;
        strokeDashArray?: Array<number>;
    }) {
        super();

        this.setType("Rect");

        this.__createSVGNode("rect", {
            x: args?.x ?? 0,
            y: args?.y ?? 0,
            width: args?.width ?? 40,
            height: args?.height ?? 40,
            rx: args?.rx ?? 0,
            ry: args?.ry ?? 0,
            fill: args?.fill ?? C.white,
            fillOpacity: args?.fillOpacity ?? 1,
            stroke: args?.stroke ?? C.black,
            strokeOpacity: args?.strokeOpacity ?? 1,
            strokeWidth: args?.strokeWidth ?? 1,
            strokeDashOffset: args?.strokeDashOffset ?? 0,
            strokeDashArray: args?.strokeDashArray ?? [],
        });

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

    setCx(cx: number) {
        return this.setCenterX(cx);
    }

    setCenterY(cy: number) {
        return this.setY(this.getY() + cy - this.getCenterY());
    }

    setCy(cy: number) {
        return this.setCenterY(cy);
    }

    setCenter(center: [number, number]): this;
    setCenter(cx: number, cy: number): this;
    setCenter(cx: number | [number, number], cy?: number) {
        if (Array.isArray(cx)) return this.setCenter(cx[0], cx[1]);
        return this.setCenterX(cx).setCenterY(cy);
    }

    getRx(): number {
        return this.vars.rx;
    }

    setRx(rx: number): this {
        this.vars.lpset("rx", rx);
        return this;
    }

    getRy(): number {
        return this.vars.ry;
    }

    setRy(ry: number): this {
        this.vars.lpset("ry", ry);
        return this;
    }

    setBorderRadius(r: number): this {
        return this.setRx(r).setRy(r);
    }
}
