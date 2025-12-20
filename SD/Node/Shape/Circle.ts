import { BaseShape } from "@/Node/Shape/BaseShape";
import { SDColor, Color as C } from "@/Utility/Color";
import { SDNode } from "@/Node/SDNode";

export class Circle extends BaseShape {
    constructor(args?: {
        targetNode?: SDNode;
        cx?: number;
        cy?: number;
        r?: number;
        fill?: SDColor;
        fillOpacity?: number;
        stroke?: SDColor;
        strokeOpacity?: number;
        strokeWidth?: number;
        strokeDashOffset?: number;
        strokeDashArray?: Array<number>;
    }) {
        super();

        this.setType("Circle");

        this.__createSVGNode("circle", {
            cx: args?.cx ?? 0,
            cy: args?.cy ?? 0,
            r: args?.r ?? 20,
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

    getCenterX(): number {
        return this.vars.cx;
    }

    setCenterX(cx: number): this {
        this.vars.lpset("cx", cx);
        return this;
    }

    setCx(cx: number): this {
        return this.setCenterX(cx);
    }

    getCenterY(): number {
        return this.vars.cy;
    }

    setCenterY(cy: number): this {
        this.vars.lpset("cy", cy);
        return this;
    }

    setCy(cy: number): this {
        return this.setCenterY(cy);
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

    setX(x: number): this {
        return this.setCenterX(this.getCenterX() + x - this.getX());
    }

    getY(): number {
        return this.getCenterY() - this.getR();
    }

    setY(y: number): this {
        return this.setCenterY(this.getCenterY() + y - this.getY());
    }

    getWidth(): number {
        return this.getR() * 2;
    }

    setWidth(width: number): this {
        return this.setR(width / 2);
    }

    getHeight(): number {
        return this.getR() * 2;
    }

    setHeight(height: number): this {
        return this.setR(height / 2);
    }
}
