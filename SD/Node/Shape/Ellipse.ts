import { BaseShape } from "@/Node/Shape/BaseShape";
import { SDColor, Color as C } from "@/Utility/Color";
import { SDNode } from "@/Node/SDNode";

export class Ellipse extends BaseShape {
    constructor(args?: {
        targetNode?: SDNode;
        cx?: number;
        cy?: number;
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

        this.setType("Ellipse");

        this.__createSVGNode("ellipse", {
            rx: args?.rx ?? 20,
            ry: args?.ry ?? 20,
            cx: args?.cx ?? 20,
            cy: args?.cy ?? 20,
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

    getX() {
        return this.getCenterX() - this.getRx();
    }

    getY() {
        return this.getCenterY() - this.getRy();
    }

    getWidth() {
        return this.getRx() * 2;
    }

    getHeight() {
        return this.getRy() * 2;
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
}
