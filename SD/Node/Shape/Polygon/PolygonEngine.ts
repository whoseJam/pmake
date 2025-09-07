import { RenderNode } from "@/Renderer/RenderNode";
import { svg } from "@/sd";

export class PolygonEngine {
    static polygonSVG = undefined;
    static init() {
        this.polygonSVG = RenderNode.createRenderNodeWithoutAction(undefined, svg(), "polygon");
        this.polygonSVG.setAttribute("opacity", 0);
    }
    static pointsToBox(points: Array<[number, number]>) {
        if (points.length < 3) return undefined;
        let x = points[0][0];
        let y = points[0][1];
        let mx = x;
        let my = y;
        for (let i = 1; i < points.length; i++) {
            x = Math.min(x, points[i][0]);
            y = Math.min(y, points[i][1]);
            mx = Math.max(mx, points[i][0]);
            my = Math.max(my, points[i][1]);
        }
        return {
            x,
            y,
            width: mx - x,
            height: my - y,
        };
    }
}
