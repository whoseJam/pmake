import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";
import { TimingFunction as T } from "@/Math/TimingFunction";
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
        return this._.cx;
    }

    setCenterX(cx: number): this {
        const vo = this._.cx;
        this._.cx = cx;

        return this;
    }

    getCenterY(): number {
        return this._.cy;
    }

    setCenterY(cy: number): this {
        const vo = this._.cy;
        this._.cy = cy;

        return this;
    }

    setCenter(center: [number, number]): this;
    setCenter(cx: number, cy: number): this;
    setCenter(cx: number | [number, number], cy?: number) {
        if (Array.isArray(cx)) return this.setCenter(cx[0], cx[1]);
        return this.setCenterX(cx).setCenterY(cy);
    }

    getRx(): number {
        return this._.rx;
    }

    setRx(rx: number): this {
        const vo = this._.rx;
        this._.rx = rx;

        return this;
    }

    getRy(): number {
        return this._.ry;
    }

    setRy(ry: number): this {
        const vo = this._.ry;
        this._.ry = ry;
        return this;
    }
}
