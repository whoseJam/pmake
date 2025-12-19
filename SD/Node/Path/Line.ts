import { Vector as V } from "@/Math/Vector";
import { BasePath } from "@/Node/Path/BasePath";
import { SDNode } from "@/Node/SDNode";

export class Line extends BasePath {
    constructor(args?: { targetNode?: SDNode; x1?: number; y1?: number; x2?: number; y2?: number }) {
        super();

        this.setType("Line");

        this.__createSVGNode("line", {
            x1: args?.x1 ?? 0,
            y1: args?.y1 ?? 0,
            x2: args?.x2 ?? 40,
            y2: args?.y2 ?? 40,
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
        return this.vars.x1;
    }

    setX1(x1: number): this {
        this.vars.lpset("x1", x1);
        return this;
    }

    getX2(): number {
        return this.vars.x2;
    }

    setX2(x2: number): this {
        this.vars.lpset("x2", x2);
        return this;
    }

    getY1(): number {
        return this.vars.y1;
    }

    setY1(y1: number) {
        this.vars.lpset("y1", y1);
        return this;
    }

    getY2(): number {
        return this.vars.y2;
    }

    setY2(y2: number): this {
        this.vars.lpset("y2", y2);
        return this;
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
