import { BasePath } from "@/Node/Path/BasePath";
import { PolylineEngine } from "@/Node/Path/PolylineEngine";

export class Polyline extends BasePath {
    constructor() {
        super();

        this.__createSVGNode("polyline", {
            points: [],
        });

        this.setType("Polyline");
    }
    getX() {
        return PolylineEngine.toBox(this.vars.points).x;
    }
    getY() {
        return PolylineEngine.toBox(this.vars.points).y;
    }
    getWidth() {
        return PolylineEngine.toBox(this.vars.points).width;
    }
    getHeight() {
        return PolylineEngine.toBox(this.vars.points).height;
    }
    getPointAtRate(k: number) {
        return PolylineEngine.getPointByRate(this.vars.points, k);
    }
    getPointAtLength(length: number): [number, number] {
        return PolylineEngine.getPointAtLength(this.vars.points, length);
    }
    totalLength(): number {
        return PolylineEngine.getTotalLength(this.vars.points);
    }
    getPoints(): Array<[number, number]> {
        return this.vars.points;
    }
    setPoints(points: Array<[number, number]>): this {
        this.vars.points = points;
        return this;
    }
}
