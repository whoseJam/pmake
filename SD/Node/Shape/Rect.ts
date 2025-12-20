import { BaseShape } from "@/Node/Shape/BaseShape";
import { SDColor, Color as C } from "@/Utility/Color";
import { SDNode } from "@/Node/SDNode";
import { Interp } from "@/Animate/Interp";

export class Rect extends BaseShape {
    _: BaseShape["_"] & {
        x: number;
        y: number;
        width: number;
        height: number;
        rx: number;
        ry: number;
    };

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
        return this._.x;
    }

    setX(x: number): this {
        return this.triggerAttributeChanged(this._.renderer, "x", x, this._.x, Interp.numberInterp);
    }

    onXChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("x", listener);
    }

    offXChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("x", listener);
    }

    getY(): number {
        return this._.y;
    }

    setY(y: number): this {
        return this.triggerAttributeChanged(this._.renderer, "y", y, this._.y, Interp.numberInterp);
    }

    onYChanged(listener: (vn: number, vo: number) => void) {
        return this.onAttributeChanged("y", listener);
    }

    offYChanged(listener: (vn: number, vo: number) => void) {
        return this.offAttributeChanged("y", listener);
    }

    getWidth(): number {
        return this._.width;
    }

    setWidth(width: number) {
        return this.triggerAttributeChanged(this._.renderer, "width", width, this._.width, Interp.numberInterp);
    }

    onWidthChanged(listener: (vn: number, vo: number) => void): this {
        return this.onAttributeChanged("width", listener);
    }

    offWidthChanged(listener: (vn: number, vo: number) => void): this {
        return this.offAttributeChanged("width", listener);
    }

    getHeight(): number {
        return this._.height;
    }

    setHeight(height: number) {
        return this.triggerAttributeChanged(this._.renderer, "height", height, this._.height, Interp.numberInterp);
    }

    onHeightChanged(listener: (vn: number, vo: number) => void): this {
        return this.onAttributeChanged("height", listener);
    }

    offHeightChanged(listener: (vn: number, vo: number) => void): this {
        return this.offAttributeChanged("height", listener);
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
        return this._.rx;
    }

    setRx(rx: number): this {
        return this.triggerAttributeChanged(this._.renderer, "rx", rx, this._.rx, Interp.numberInterp);
    }

    getRy(): number {
        return this._.ry;
    }

    setRy(ry: number): this {
        return this.triggerAttributeChanged(this._.renderer, "ry", ry, this._.ry, Interp.numberInterp);
    }

    setBorderRadius(r: number): this {
        return this.setRx(r).setRy(r);
    }
}
