import { svg } from "@/Interact/Root";

export class PathEngine {
    static pathSVG = undefined;
    static polylineSVG = undefined;
    static init() {
        this.pathSVG = svg().append("path");
        this.pathSVG.setAttribute("opacity", 0);
        this.polylineSVG = svg().append("polyline");
        this.polylineSVG.setAttribute("opacity", 0);
    }
    static getPathPointAtLength(d: string, length: number) {
        try {
            this.pathSVG.setAttribute("d", d);
            const point = this.pathSVG.nake().getPointAtLength(length);
            return [point.x, point.y];
        } catch (err) {
            return [0, 0];
        }
    }
    static getPolylinePointAtLength(points: Array<[number, number]>, length: number) {
        try {
            this.polylineSVG.setAttribute("points", points);
            const point = this.polylineSVG.nake().getPointAtLength(length);
            return [point.x, point.y];
        } catch (err) {
            return [0, 0];
        }
    }
    static getPathPointAtRate(d: string, k: number) {
        try {
            this.pathSVG.setAttribute("d", d);
            const length = this.pathSVG.nake().getTotalLength() * k;
            const point = this.pathSVG.nake().getPointAtLength(length);
            return point;
        } catch (err) {
            return [0, 0];
        }
    }
    static getPolylinePointAtRate(d: string, k: number) {
        try {
            this.polylineSVG.setAttribute("d", d);
            const length = this.polylineSVG.nake().getTotalLength() * k;
            const point = this.polylineSVG.nake().getPointAtLength(length);
            return point;
        } catch (err) {
            return [0, 0];
        }
    }
    static getPathTotalLength(d: string) {
        try {
            this.pathSVG.setAttribute("d", d);
            return this.pathSVG.nake().getTotalLength();
        } catch (err) {
            return 0;
        }
    }
    static getPolylineTotalLength(d: string) {
        try {
            this.polylineSVG.setAttribute("d", d);
            return this.polylineSVG.nake().getTotalLength();
        } catch (err) {
            return 0;
        }
    }
}
