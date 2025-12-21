import { Interp } from "@/Animate/Interp";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { SDColor, Color as C } from "@/Utility/Color";
import { Group } from "@/Node/Other/Group";

export class Circle extends BaseShape {
    constructor(args?: {
        targetNode?: Group;
        cx?: number;
        cy?: number;
        r?: number;
        opacity?: number;
        fill?: SDColor;
        fillOpacity?: number;
        stroke?: SDColor;
        strokeOpacity?: number;
        strokeWidth?: number;
        strokeDashOffset?: number;
        strokeDashArray?: Array<number>;
    }) {
        super();

        this._.renderer = this.createSVGNode("circle", {
            cx: args?.cx ?? 0,
            cy: args?.cy ?? 0,
            r: args?.r ?? 20,
            opacity: args?.opacity ?? 1,
            fill: args?.fill ?? C.white,
            fillOpacity: args?.fillOpacity ?? 1,
            stroke: args?.stroke ?? C.none,
            strokeOpacity: args?.strokeOpacity ?? 1,
            strokeWidth: args?.strokeWidth ?? 1,
            strokeDashOffset: args?.strokeDashOffset ?? 0,
            strokeDashArray: args?.strokeDashArray ?? [],
        });

        args?.targetNode?.appendChild(this);
    }

    getCx(): number {
        return this._.cx;
    }

    setCx(cx: number): this {
        return this.triggerAttributeChanged(this._.renderer, "cx", cx, this._.cx, Interp.numberInterp);
    }

    onCxChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("cx", listener);
    }

    offCxChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("cx", listener);
    }

    getCenterX(): number {
        return this.getCx();
    }

    setCenterX(cx: number): this {
        return this.setCx(cx);
    }

    onCenterXChanged(listener: (vn: number, vo: number) => void) {
        return this.onCxChanged(listener);
    }

    offCenterXChanged(listener: (vn: number, vo: number) => void) {
        return this.offCxChanged(listener);
    }

    getCy(): number {
        return this._.cy;
    }

    setCy(cy: number): this {
        return this.triggerAttributeChanged(this._.renderer, "cy", cy, this._.cy, Interp.numberInterp);
    }

    onCyChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("cy", listener);
    }

    offCyChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("cy", listener);
    }

    getCenterY(): number {
        return this.getCy();
    }

    setCenterY(cy: number): this {
        return this.setCy(cy);
    }

    onCenterYChanged(listener: (vn: number, vo: number) => void) {
        return this.onCyChanged(listener);
    }

    offCenterYChanged(listener: (vn: number, vo: number) => void) {
        return this.offCyChanged(listener);
    }

    setCenter(center: [number, number]): this;
    setCenter(cx: number, cy: number): this;
    setCenter(cx: number | [number, number], cy?: number) {
        if (Array.isArray(cx)) return this.setCenter(cx[0], cx[1]);
        return this.setCenterX(cx).setCenterY(cy);
    }

    getR(): number {
        return this._.r;
    }

    setR(r: number): this {
        return this.triggerAttributeChanged(this._.renderer, "r", r, this._.r, Interp.numberInterp);
    }

    onRChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("r", listener);
    }

    offRChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("r", listener);
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
