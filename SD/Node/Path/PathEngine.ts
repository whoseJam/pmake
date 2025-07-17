import { svg } from "@/Interact/Root";
import { SD2DNode } from "../SD2DNode";

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
    static __trimPathSource(source: SD2DNode) {
        if (!source) return 0;
        const t = this.pathSVG.nake().getTotalLength();
        let l = 0;
        let r = 1;
        while (r - l > 1e-3) {
            const mid = (l + r) / 2.0;
            const length = t * mid;
            const point = this.pathSVG.nake().getPointAtLength(length);
            if (source.inRange([point.x, point.y])) l = mid;
            else r = mid;
        }
        if (t * l <= 1) return 0;
        return l;
    }
    static __trimPathTarget(target: SD2DNode) {
        if (!target) return 1;
        const t = this.pathSVG.nake().getTotalLength();
        let l = 0;
        let r = 1;
        while (r - l > 1e-3) {
            const mid = (l + r) / 2.0;
            const length = t * mid;
            const point = this.pathSVG.nake().getPointAtLength(length);
            if (target.inRange([point.x, point.y])) r = mid;
            else l = mid;
        }
        if (t * (1 - l) <= 1) return 1;
        return l;
    }
    static trimPath(d: string, source: SD2DNode, target: SD2DNode) {
        try {
            this.pathSVG.setAttribute("d", d);
            const length = this.pathSVG.nake().getTotalLength();
            const s = this.__trimPathSource(source);
            const t = this.__trimPathTarget(target);
            const ps = this.pathSVG.nake().getPointAtLength(s * length);
            const pt = this.pathSVG.nake().getPointAtLength(t * length);
            return [
                [ps.x, ps.y],
                [pt.x, pt.y],
            ];
        } catch (err) {
            return [
                [0, 0],
                [0, 0],
            ];
        }
    }
}
