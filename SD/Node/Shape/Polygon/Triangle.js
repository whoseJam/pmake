import { Polygon } from "@/Node/Shape/Polygon";

export class Triangle extends Polygon {
    constructor(target) {
        const { TriangleSVG } = require("@/Node/SVG/Shape/Polygon/TriangleSVG");
        return new TriangleSVG(target);
    }
}
