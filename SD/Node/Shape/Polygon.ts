import { Interp } from "@/Animate/Interp";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { PolygonEngine } from "@/Node/Shape/PolygonEngine";

export class Polygon extends BaseShape {
    constructor() {
        super();

        this.setType("Polygon");

        this._.renderer = this.__createSVGNode("polygon", {
            points: [],
        });
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
