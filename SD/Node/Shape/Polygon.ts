import { SDNode } from "@/Node/SDNode";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { PolygonEngine } from "@/Node/Shape/Polygon/PolygonEngine";
import { RenderNode } from "@/Renderer/RenderNode";

export class Polygon extends BaseShape {
    constructor(target: SDNode | RenderNode, points = []) {
        super(target);

        this.__createSVGNode("polygon", {
            points: points.length >= 3 ? points : [],
        });
        this.vars.merge(PolygonEngine.pointsToBox(points));

        this.type("Polygon");
    }
    toPolygon() {
        // return polygon(this.vars.points.map(v => v));
    }
    x(): number;
    x(x: number): this;
    x(x?: number) {
        if (arguments.length === 0) return this.vars.x;
        const dx = x - this.x();
        this.vars.x = x;
        return this.__points(this.points().map(v => [v[0] + dx, v[1]]));
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        if (arguments.length === 0) return this.vars.y;
        const dy = y - this.y();
        this.vars.y = y;
        return this.__points(this.points().map(v => [v[0], v[1] + dy]));
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.vars.width;
        const x = this.x();
        const k = width / this.width();
        this.vars.width = width;
        return this.__points(this.points().map(v => [(v[0] - x) * k + x, v[1]]));
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.vars.height;
        const y = this.y();
        const k = height / this.height();
        this.vars.height = height;
        return this.__points(this.points().map(v => [v[0], (v[1] - y) * k + y]));
    }
    points(): Array<[number, number]>;
    points(points: Array<[number, number]>): this;
    points(points?: Array<[number, number]>) {
        if (arguments.length === 0) return this.vars.points;
        this.__points(points);
        this.vars.setTogether(PolygonEngine.pointsToBox(points));
        return this;
    }
    __points(points: Array<[number, number]>) {
        this.vars.points = points;
        return this;
    }
}
