import { BasePath } from "@/Node/Path/BasePath";
import { PathEngine } from "@/Node/Path/PathEngine";
import { Group } from "@/Node/Other/Group";
import { SDColor, Color as C } from "@/Utility/Color";
import { Filter, SDFilter } from "@/Node/Filter/Filter";
import { SDSVGNode } from "@/Node/SDSVGNode";

export class Path extends BasePath {
    _: BasePath["_"] & {
        d: string;
        x: number;
        y: number;
        width: number;
        height: number;
    };

    constructor(args?: {
        targetNode?: Group;
        opacity?: number;
        d?: string;
        fill?: SDColor;
        fillOpacity?: number;
        stroke?: SDColor;
        strokeOpacity?: number;
        strokeWidth?: number;
        strokeDashOffset?: number;
        strokeDashArray?: string | number | Array<number>;
        filter?: SDFilter;
    }) {
        super();

        this.createSVGNode("path", {
            d: args?.d ?? "",
            fill: args?.fill ?? C.none,
            fillOpacity: args?.fillOpacity ?? 1,
            stroke: args?.stroke ?? C.black,
            strokeOpacity: args?.strokeOpacity ?? 1,
            strokeWidth: args?.strokeWidth ?? 1,
            strokeDashOffset: args?.strokeDashOffset ?? 0,
            strokeDashArray: SDSVGNode.toStrokeDashArray(args?.strokeDashArray),
            filter: Filter.toURLString(args?.filter),
        });

        const box = PathEngine.toBox(args?.d ?? "");

        Object.assign(this._, {
            d: args?.d ?? "",
            x: box.x ?? 0,
            y: box.y ?? 0,
            width: box.width ?? 0,
            height: box.height ?? 0,
        });

        args?.targetNode?.appendChild(this);
    }

    getX() {
        return this._.x;
    }

    getY() {
        return this._.y;
    }

    getWidth() {
        return this._.width;
    }

    getHeight() {
        return this._.height;
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
        return this._.d;
    }

    setD(d: string): this {
        Object.assign(this._, { d, ...PathEngine.toBox(d) });
        return this.triggerAttributeChanged(this._.renderer, "d", d, this._.d);
    }
}
