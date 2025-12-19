import { BasePath } from "@/Node/Path/BasePath";
import { PathEngine } from "@/Node/Path/PathEngine";
import { SDNode } from "@/Node/SDNode";
import { SDColor, Color as C } from "@/Utility/Color";

export class Path extends BasePath {
    constructor(args?: {
        targetNode?: SDNode;
        opacity?: number;
        d?: string;
        stroke?: SDColor;
        strokeWidth?: number;
        strokeDashOffset?: number;
        strokeDashArray?: Array<number>;
    }) {
        super();

        this.setType("Path");

        this.__createSVGNode("path", {
            d: args?.d || "",
            stroke: args?.stroke ?? C.black,
            strokeWidth: args?.strokeWidth ?? 0,
            strokeDashOffset: args?.strokeDashOffset ?? 0,
            strokeDashArray: args?.strokeDashArray ?? [],
        });

        this.vars.merge({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        });

        args?.targetNode?.appendChild(this);
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
        return PathEngine.getPointByRate(this.getD(), k);
    }

    getPointAtLength(length: number) {
        return PathEngine.getPointAtLength(this.getD(), length);
    }

    totalLength() {
        return PathEngine.getTotalLength(this.getD());
    }

    getD(): string {
        return this.vars.d;
    }
    setD(d: string): this {
        this.vars.d = d;
        this.vars.setTogether(PathEngine.toBox(d));
        return this;
    }
}
