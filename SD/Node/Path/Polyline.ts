import { BasePath } from "@/Node/Path/BasePath";
import { PolylineEngine } from "@/Node/Path/PolylineEngine";
import { SDNode } from "@/Node/SDNode";
import { Polygon } from "@/Node/Shape/Polygon";
import { RenderNode } from "@/Renderer/RenderNode";

export class Polyline extends BasePath {
    constructor(target: SDNode | RenderNode, points = []) {
        super(target);

        this.__createSVGNode("polyline", {
            points,
        });
        this.vars.merge(PolylineEngine.toBox(points));

        this.type("Polyline");

        this.type("Polyline");
    }
    x(): number;
    x(x: number): this;
    x(x?: number) {
        if (arguments.length === 0) return Polygon.prototype.x.call(this);
        return Polygon.prototype.x.call(this, x);
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        if (arguments.length === 0) return Polygon.prototype.y.call(this);
        return Polygon.prototype.y.call(this, y);
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return Polygon.prototype.width.call(this);
        return Polygon.prototype.width.call(this, width);
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return Polygon.prototype.height.call(this);
        return Polygon.prototype.height.call(this, height);
    }
    at(k: number) {
        return PolylineEngine.getPointByRate(this.points(), k);
    }
    getPointAtLength(length: number): [number, number] {
        return PolylineEngine.getPointAtLength(this.points(), length);
    }
    length(): number {
        return PolylineEngine.getTotalLength(this.points());
    }
    points(): Array<[number, number]>;
    points(points: Array<[number, number]>): this;
    points(points?: Array<[number, number]>) {
        if (arguments.length === 0) return this.vars.points;
        this.__points(points);
        this.vars.setTogether(PolylineEngine.toBox(points));
        return this;
    }
    __points(points: Array<[number, number]>) {
        return Polygon.prototype.__points.call(this, points);
    }
}
