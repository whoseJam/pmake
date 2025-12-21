import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";
import { TimingFunction as T } from "@/Math/TimingFunction";
import { Vector as V } from "@/Math/Vector";
import { BasePath } from "@/Node/Path/BasePath";
import { Group } from "@/Node/Other/Group";
import { SDColor, Color as C } from "@/Utility/Color";

export class Line extends BasePath {
    constructor(args?: {
        targetNode?: Group;
        x1?: number;
        y1?: number;
        x2?: number;
        y2?: number;
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

        this.createSVGNode("line", {
            x1: args?.x1 ?? 0,
            y1: args?.y1 ?? 0,
            x2: args?.x2 ?? 40,
            y2: args?.y2 ?? 40,
            opacity: args?.opacity ?? 1,
            fill: args?.fill ?? C.none,
            fillOpacity: args?.fillOpacity ?? 0,
            stroke: args?.stroke ?? C.black,
            strokeOpacity: args?.strokeOpacity ?? 1,
            strokeWidth: args?.strokeWidth ?? 1,
            strokeDashOffset: args?.strokeDashOffset ?? 0,
            strokeDashArray: args?.strokeDashArray ?? [],
        });

        args?.targetNode?.appendChild(this);
    }

    getX() {
        return Math.min(this.getX1(), this.getX2());
    }

    getY() {
        return Math.min(this.getY1(), this.getY2());
    }

    getMaxX() {
        return Math.max(this.getX1(), this.getY1());
    }

    getMaxY() {
        return Math.max(this.getY1(), this.getY2());
    }

    getWidth() {
        return this.getMaxX() - this.getX();
    }

    getHeight() {
        return this.getMaxY() - this.getY();
    }

    getX1(): number {
        return this._.x1;
    }

    setX1(x1: number): this {
        const vo = this._.x1;
        this._.x1 = x1;
        this.watchX1(x1, vo);
        return this;
    }
    watchX1(vn: number, vo: number) {
        if (Math.abs(vn - vo) < 1) return;
        if (Window.ACTION_TICK !== 0) {
            this._.renderer.setAttribute("x1", vn);
            return;
        }
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            vo,
            vn,
            Interp.numberInterp(this._.renderer, "x1"),
            this._.timingFunction ?? T.easeInOut,
            this,
            "x1"
        );
    }

    getX2(): number {
        return this._.x2;
    }

    setX2(x2: number): this {
        const vo = this._.x2;
        this._.x2 = x2;
        this.watchX2(x2, vo);
        return this;
    }
    watchX2(vn: number, vo: number) {
        if (Math.abs(vn - vo) < 1) return;
        if (Window.ACTION_TICK !== 0) {
            this._.renderer.setAttribute("x2", vn);
            return;
        }
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            vo,
            vn,
            Interp.numberInterp(this._.renderer, "x2"),
            this._.timingFunction ?? T.easeInOut,
            this,
            "x2"
        );
    }

    getY1(): number {
        return this._.y1;
    }

    setY1(y1: number) {
        const vo = this._.y1;
        this._.y1 = y1;
        this.watchY1(y1, vo);
        return this;
    }
    watchY1(vn: number, vo: number) {
        if (Math.abs(vn - vo) < 1) return;
        if (Window.ACTION_TICK !== 0) {
            this._.renderer.setAttribute("y1", vn);
            return;
        }
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            vo,
            vn,
            Interp.numberInterp(this._.renderer, "y1"),
            this._.timingFunction ?? T.easeInOut,
            this,
            "y1"
        );
    }

    getY2(): number {
        return this._.y2;
    }

    setY2(y2: number): this {
        const vo = this._.y2;
        this._.y2 = y2;
        this.watchY2(y2, vo);
        return this;
    }
    watchY2(vn: number, vo: number) {
        if (Math.abs(vn - vo) < 1) return;
        if (Window.ACTION_TICK !== 0) {
            this._.renderer.setAttribute("y2", vn);
            return;
        }
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            vo,
            vn,
            Interp.numberInterp(this._.renderer, "y2"),
            this._.timingFunction ?? T.easeInOut,
            this,
            "y2"
        );
    }

    getSourcePoint(): [number, number] {
        return [this.getX1(), this.getY1()];
    }

    setSourcePoint(p: [number, number]): this;
    setSourcePoint(x: number, y: number): this;
    setSourcePoint(x: number | [number, number], y?: number) {
        if (Array.isArray(x)) return this.setSourcePoint(x[0], x[1]);
        return this.setX1(x).setY1(y);
    }

    getTargetPoint(): [number, number] {
        return [this.getX2(), this.getY2()];
    }

    setTargetPoint(p: [number, number]): this;
    setTargetPoint(x: number, y: number): this;
    setTargetPoint(x: number | [number, number], y?: number) {
        if (Array.isArray(x)) return this.setTargetPoint(x[0], x[1]);
        return this.setX2(x).setY2(y);
    }

    getPointAtRate(k: number) {
        const v1 = this.getSourcePoint();
        const v2 = this.getTargetPoint();
        const d = V.sub(v2, v1);
        return V.add(v1, V.numberMul(d, k));
    }

    getPointAtLength(length: number) {
        const total = this.totalLength();
        const k = length / total;
        return this.getPointAtRate(k);
    }

    totalLength() {
        const v1 = this.getSourcePoint();
        const v2 = this.getTargetPoint();
        return V.norm(V.sub(v1, v2));
    }
}
