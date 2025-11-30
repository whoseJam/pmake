import { Vector as V } from "@/Math/Vector";
import { BasePath } from "@/Node/Path/BasePath";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Line extends BasePath {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.__createSVGNode("line", {
            x1: 0,
            y1: 0,
            x2: 40,
            y2: 40,
        });

        this.type("Line");
    }
    x1(): number;
    x1(x1: number): this;
    x1(x1?: number) {
        if (arguments.length === 0) return this.vars.x1;
        this.vars.lpset("x1", x1);
        return this;
    }
    x2(): number;
    x2(x2: number): this;
    x2(x2?: number) {
        if (arguments.length === 0) return this.vars.x2;
        this.vars.lpset("x2", x2);
        return this;
    }
    y1(): number;
    y1(y1: number): this;
    y1(y1?: number) {
        if (arguments.length === 0) return this.vars.y1;
        this.vars.lpset("y1", y1);
        return this;
    }
    y2(): number;
    y2(y2: number): this;
    y2(y2?: number) {
        if (arguments.length === 0) return this.vars.y2;
        this.vars.lpset("y2", y2);
        return this;
    }
    source(): [number, number];
    source(x1: number, y1: number): this;
    source(v: [number, number]): this;
    source(x1?: number | [number, number], y1?: number) {
        if (arguments.length === 0) return [this.x1(), this.y1()];
        if (typeof x1 === "number") return this.x1(x1).y1(y1);
        return this.x1(x1[0]).y1(x1[1]);
    }
    target(): [number, number];
    target(x2: number, y2: number): this;
    target(v: [number, number]): this;
    target(x2?: number | [number, number], y2?: number) {
        if (arguments.length === 0) return [this.x2(), this.y2()];
        if (typeof x2 === "number") return this.x2(x2).y2(y2);
        return this.x2(x2[0]).y2(x2[1]);
    }
    x(): number;
    x(x: number): this;
    x(x?: number) {
        const x1 = this.x1();
        const x2 = this.x2();
        const ox = Math.min(x1, x2);
        if (arguments.length === 0) return ox;
        const dx = x - ox;
        return this.x1(x1 + dx).x2(x2 + dx);
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        const y1 = this.y1();
        const y2 = this.y2();
        const oy = Math.min(y1, y2);
        if (arguments.length === 0) return oy;
        const dy = y - oy;
        return this.y1(y1 + dy).y2(y2 + dy);
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        const x1 = this.x1();
        const x2 = this.x2();
        if (arguments.length === 0) return Math.abs(x1 - x2);
        if (x1 < x2) this.x2(x1 + width);
        else this.x1(x2 + width);
        return this;
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        const y1 = this.y1();
        const y2 = this.y2();
        if (arguments.length === 0) return Math.abs(y1 - y2);
        if (y1 < y2) this.y2(y1 + height);
        else this.y1(y2 + height);
        return this;
    }
    at(k: number) {
        const v1 = this.source();
        const v2 = this.target();
        const d = V.sub(v2, v1);
        return V.add(v1, V.numberMul(d, k));
    }
    getPointAtLength(length: number) {
        const total = this.totalLength();
        const k = length / total;
        return this.at(k);
    }
    totalLength() {
        const v1 = this.source();
        const v2 = this.target();
        return V.norm(V.sub(v1, v2));
    }
}
