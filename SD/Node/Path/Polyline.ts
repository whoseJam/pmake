import { BasePath } from "@/Node/Path/BasePath";
import { PolylineEngine } from "@/Node/Path/PolylineEngine";
import { Group } from "@/Node/Other/Group";

export class Polyline extends BasePath {
    constructor(args?: { targetNode?: Group; points?: Array<[number, number]> }) {
        super();

        this.createSVGNode("polyline", {
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
