import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";
import { TimingFunction as T } from "@/Math/TimingFunction";
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
        const vo = this._.points;
        this._.points = points;
        return this;
    }
}
