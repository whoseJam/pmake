import { BasePath } from "@/Node/Path/BasePath";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDNode } from "../SDNode";
import { PathEngine } from "./PathEngine";

export class Path extends BasePath {
    constructor(target: SDNode | RenderNode, value?: any) {
        super(target);

        this.__createSVGNode("path", {
            d: "M0,0L0,0",
        });
        this.vars.merge({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        });

        this.type("Path");

        this.value(value);
    }
    x(): number;
    x(x: number): this;
    x(x?: number) {
        if (arguments.length === 0) return this.vars.x;
        const [x0, y0, dx, dy, sx, sy] = [this.x(), this.y(), x - this.vars.x, 0, 1, 1];
        this.d(PathEngine.updatePath(this.vars.d, x0, y0, dx, dy, sx, sy));
        return this;
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        if (arguments.length === 0) return this.vars.y;
        const [x0, y0, dx, dy, sx, sy] = [this.x(), this.y(), 0, y - this.vars.y, 1, 1];
        this.d(PathEngine.updatePath(this.vars.d, x0, y0, dx, dy, sx, sy));
        return this;
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.vars.width;
        if (this.width() === 0) return this;
        const [x0, y0, dx, dy, sx, sy] = [this.x(), this.y(), 0, 0, width / this.width(), 1];
        this.d(PathEngine.updatePath(this.vars.d, x0, y0, dx, dy, sx, sy));
        return this;
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.vars.height;
        if (this.height() === 0) return this;
        const [x0, y0, dx, dy, sx, sy] = [this.x(), this.y(), 0, 0, 1, height / this.height()];
        this.d(PathEngine.updatePath(this.vars.d, x0, y0, dx, dy, sx, sy));
        return this;
    }
    at(k: number) {
        return PathEngine.getPointByRate(this.d(), k);
    }
    getPointAtLength(length: number) {
        return PathEngine.getPointAtLength(this.d(), length);
    }
    totalLength() {
        return PathEngine.getTotalLength(this.d());
    }
    d(): string;
    d(d: string): this;
    d(d?: string) {
        if (arguments.length === 0) return this.vars.d;
        this.vars.d = d;
        this.vars.setTogether(PathEngine.toBox(d));
        return this;
    }
}
