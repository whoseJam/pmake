import { BaseShape } from "@/Node/Shape/BaseShape";
import { PolygonEngine } from "@/Node/Shape/PolygonEngine";

export class Polygon extends BaseShape {
    constructor() {
        super();

        this.__createSVGNode("polygon", {
            points: [],
        });

        this.setType("Polygon");
    }
    getX() {
        return PolygonEngine.pointsToBox(this.vars.points).x;
    }
    getY() {
        return PolygonEngine.pointsToBox(this.vars.points).y;
    }
    getWidth() {
        return PolygonEngine.pointsToBox(this.vars.points).width;
    }
    getHeight() {
        return PolygonEngine.pointsToBox(this.vars.points).height;
    }
    getPoints() {
        return this.vars.points;
    }
    setPoints(points: Array<[number, number]>): this {
        this.vars.points = points;
        return this;
    }
}
