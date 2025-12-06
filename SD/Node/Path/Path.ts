import { BasePath } from "@/Node/Path/BasePath";
import { PathEngine } from "@/Node/Path/PathEngine";

export class Path extends BasePath {
    constructor() {
        super();

        this.__createSVGNode("path", {
            d: "M0,0L0,0",
        });
        this.vars.merge({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        });

        this.setType("Path");
    }
    getX() {
        return this.vars.x;
    }
    getY() {
        return this.vars.y;
    }
    getWidth() {
        return this.vars.width;
    }
    getHeight() {
        return this.vars.height;
    }
    getPointAtRate(k: number) {
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
