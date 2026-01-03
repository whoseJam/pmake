import { Interp } from "@/Animate/Interp";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { PolygonEngine } from "@/Node/Shape/PolygonEngine";
import { Group } from "@/Node/Other/Group";
import { SDColor, Color as C } from "@/Utility/Color";
import { Filter, SDFilter } from "@/Node/Filter/Filter";
import { SDSVGNode, StrokeLineCap, StrokeLineJoin } from "@/Node/SDSVGNode";

export class Polygon extends BaseShape {
    _: BaseShape["_"] & {
        points: Array<[number, number]>;
    };

    constructor(args?: {
        targetNode?: Group;
        points?: Array<[number, number]>;
        opacity?: number;
        fill?: SDColor;
        fillOpacity?: number;
        stroke?: SDColor;
        strokeOpacity?: number;
        strokeWidth?: number;
        strokeDashOffset?: number;
        strokeDashArray?: string | number | Array<number>;
        strokeLineCap?: StrokeLineCap;
        strokeLineJoin?: StrokeLineJoin;
        filter?: SDFilter;
    }) {
        super();

        this._.renderer = this.createSVGNode("polygon", {
            points: args?.points ?? [],
            transformOrigin: ["center", "center"],
            opacity: args?.opacity ?? 1,
            fill: args?.fill ?? C.white,
            fillOpacity: args?.fillOpacity ?? 1,
            stroke: args?.stroke ?? C.none,
            strokeOpacity: args?.strokeOpacity ?? 1,
            strokeWidth: args?.strokeWidth ?? 1,
            strokeDashOffset: args?.strokeDashOffset ?? 0,
            strokeDashArray: SDSVGNode.toStrokeDashArray(args?.strokeDashArray),
            strokeLineCap: args?.strokeLineCap ?? "butt",
            strokeLineJoin: args?.strokeLineJoin ?? "miter",
            filter: Filter.toURLString(args?.filter),
        });

        args?.targetNode?.appendChild(this);
    }

    getX() {
        return PolygonEngine.pointsToBox(this._.points).x;
    }

    getY() {
        return PolygonEngine.pointsToBox(this._.points).y;
    }

    getWidth() {
        return PolygonEngine.pointsToBox(this._.points).width;
    }

    getHeight() {
        return PolygonEngine.pointsToBox(this._.points).height;
    }

    getPoints() {
        return this._.points;
    }

    setPoints(points: Array<[number, number]>): this {
        return this.triggerAttributeChanged(this._.renderer, "points", points, this._.points, Interp.pointsInterp);
    }

    onPointsChanged(listener: (vn: Array<[number, number]>, vo: Array<[number, number]>) => void) {
        return this.onAttributeChanged("points", listener);
    }

    offPointsChanged(listener: (vn: Array<[number, number]>, vo: Array<[number, number]>) => void) {
        return this.offAttributeChanged("points", listener);
    }

    setX(x: number): this {
        const box = PolygonEngine.pointsToBox(this._.points);
        const dx = x - box.x;
        const newPoints = this._.points.map(([px, py]) => [px + dx, py] as [number, number]);
        return this.setPoints(newPoints);
    }

    setY(y: number): this {
        const box = PolygonEngine.pointsToBox(this._.points);
        const dy = y - box.y;
        const newPoints = this._.points.map(([px, py]) => [px, py + dy] as [number, number]);
        return this.setPoints(newPoints);
    }

    setWidth(width: number): this {
        const box = PolygonEngine.pointsToBox(this._.points);
        const scale = width / box.width;
        const newPoints = this._.points.map(([px, py]) => [box.x + (px - box.x) * scale, py] as [number, number]);
        return this.setPoints(newPoints);
    }

    setHeight(height: number): this {
        const box = PolygonEngine.pointsToBox(this._.points);
        const scale = height / box.height;
        const newPoints = this._.points.map(([px, py]) => [px, box.y + (py - box.y) * scale] as [number, number]);
        return this.setPoints(newPoints);
    }
}
