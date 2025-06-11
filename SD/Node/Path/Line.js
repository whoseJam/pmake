import { BasePath } from "@/Node/Path/BasePath";
import { LineSVG } from "@/Node/SVG/Path/LineSVG";

export class Line extends BasePath {
    constructor(target, value) {
        return new LineSVG(target, value);
    }
}
