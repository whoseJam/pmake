import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";
import { TimingFunction as T } from "@/Math/TimingFunction";
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

        this._.cxListeners = [];
        this._.cyListeners = [];
        this._.rListeners = [];

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
        return this._.cx;
    }

    setCenterX(cx: number): this {
        const vo = this._.cx;
        this._.cx = cx;
        this.triggerCxChanged(cx, vo);
        return this;
    }
    onCxChanged(listener: (vn: number, vo: number) => void) {
        this._.cxListeners.push(listener);
        return this;
    }
    offCxChanged(listener: (vn: number, vo: number) => void) {
        const index = this._.cxListeners.indexOf(listener);
        if (index !== -1) this._.cxListeners.splice(index, 1);
        return this;
    }
    triggerCxChanged(vn: number, vo: number) {
        if (Math.abs(vn - vo) < 1) return;
        if (this._.cxListeners.length === 0) {
            if (Window.ACTION_TICK !== 0) {
                this._.renderer.setAttribute("cx", vn);
                return;
            }
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                vo,
                vn,
                Interp.numberInterp(this._.renderer, "cx"),
                this._.timingFunction ?? T.easeInOut,
                this,
                "cx"
            );
        } else {
            for (const listener of this._.cxListeners) {
                listener(vn, vo);
            }
        }
    }

    setCx(cx: number): this {
        return this.setCenterX(cx);
    }

    getCenterY(): number {
        return this._.cy;
    }

    setCenterY(cy: number): this {
        const vo = this._.cy;
        this._.cy = cy;
        this.triggerCyChanged(cy, vo);
        return this;
    }
    onCyChanged(listener: (vn: number, vo: number) => void) {
        this._.cyListeners.push(listener);
        return this;
    }
    offCyChanged(listener: (vn: number, vo: number) => void) {
        const index = this._.cyListeners.indexOf(listener);
        if (index !== -1) this._.cyListeners.splice(index, 1);
        return this;
    }
    triggerCyChanged(vn: number, vo: number) {
        if (Math.abs(vn - vo) < 1) return;
        if (this._.cyListeners.length === 0) {
            if (Window.ACTION_TICK !== 0) {
                this._.renderer.setAttribute("cy", vn);
                return;
            }
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                vo,
                vn,
                Interp.numberInterp(this._.renderer, "cy"),
                this._.timingFunction ?? T.easeInOut,
                this,
                "cy"
            );
        } else {
            for (const listener of this._.cyListeners) {
                listener(vn, vo);
            }
        }
    }

    setCy(cy: number): this {
        return this.setCenterY(cy);
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
        const vo = this._.r;
        this._.r = r;
        this.triggerRChanged(r, vo);
        return this;
    }
    onRChanged(listener: (vn: number, vo: number) => void) {
        this._.rListeners.push(listener);
        return this;
    }
    offRChanged(listener: (vn: number, vo: number) => void) {
        const index = this._.rListeners.indexOf(listener);
        if (index !== -1) this._.rListeners.splice(index, 1);
        return this;
    }
    triggerRChanged(vn: number, vo: number) {
        if (Math.abs(vn - vo) < 1) return;
        if (this._.rListeners.length === 0) {
            if (Window.ACTION_TICK !== 0) {
                this._.renderer.setAttribute("r", vn);
                return;
            }
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                vo,
                vn,
                Interp.numberInterp(this._.renderer, "r"),
                this._.timingFunction ?? T.easeInOut,
                this,
                "r"
            );
        } else {
            for (const listener of this._.rListeners) {
                listener(vn, vo);
            }
        }
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
