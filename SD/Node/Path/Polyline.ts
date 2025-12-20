import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";
import { TimingFunction as T } from "@/Math/TimingFunction";
import { BasePath } from "@/Node/Path/BasePath";
import { PolylineEngine } from "@/Node/Path/PolylineEngine";
import { SDNode } from "@/Node/SDNode";

export class Polyline extends BasePath {
    constructor(args?: { targetNode?: SDNode; points?: Array<[number, number]> }) {
        super();

        this.setType("Polyline");

        this.__createSVGNode("polyline", {
            points: args?.points ?? [],
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
        const vo = this._.points;
        this._.points = points;
        return this;
    }
}
