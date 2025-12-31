import { BasePath } from "@/Node/Path/BasePath";
import { PolylineEngine } from "@/Node/Path/PolylineEngine";
import { SDColor, Color as C } from "@/Utility/Color";
import { Filter, SDFilter } from "@/Node/Filter/Filter";
import { Group } from "@/Node/Other/Group";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { Interp } from "@/Animate/Interp";

export class Polyline extends BasePath {
    _: BasePath["_"] & {
        points: Array<[number, number]>;
    };

    constructor(args?: {
        targetNode?: Group;
        points?: Array<[number, number]>;
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

        this.createSVGNode("polyline", {
            points: args?.points ?? [],
            fill: args?.fill ?? C.none,
            fillOpacity: args?.fillOpacity ?? 1,
            stroke: args?.stroke ?? C.black,
            strokeOpacity: args?.strokeOpacity ?? 1,
            strokeWidth: args?.strokeWidth ?? 1,
            strokeDashOffset: args?.strokeDashOffset ?? 0,
            strokeDashArray: SDSVGNode.toStrokeDashArray(args?.strokeDashArray),
            filter: Filter.toURLString(args?.filter),
        });

        args?.targetNode?.appendChild(this);
    }

    getX() {
        return PolylineEngine.toBox(this._.points).x;
    }

    getY() {
        return PolylineEngine.toBox(this._.points).y;
    }

    getWidth() {
        return PolylineEngine.toBox(this._.points).width;
    }

    getHeight() {
        return PolylineEngine.toBox(this._.points).height;
    }

    getPointAtRate(k: number) {
        return PolylineEngine.getPointByRate(this._.points, k);
    }

    getPointAtLength(length: number): [number, number] {
        return PolylineEngine.getPointAtLength(this._.points, length);
    }

    totalLength(): number {
        return PolylineEngine.getTotalLength(this._.points);
    }

    getPoints(): Array<[number, number]> {
        return this._.points;
    }

    setPoints(points: Array<[number, number]>): this {
        return this.triggerAttributeChanged(this._.renderer, "points", points, this._.points, Interp.pointsInterp);
    }

    onPointsChanged(listener: (vn: Array<[number, number]>, vo: Array<[number, number]>) => void): this {
        return this.onAttributeChanged("points", listener);
    }

    offPointsChanged(listener: (vn: Array<[number, number]>, vo: Array<[number, number]>) => void): this {
        return this.offAttributeChanged("points", listener);
    }
}
