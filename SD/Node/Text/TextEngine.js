import { svg } from "@/Interact/Root";
import opentype from "opentype.js";

class TransformingPath {
    constructor(d) {
        this.d = d;
    }
}

class TransformingPathGroup {
    constructor() {
        this.transforming = [];
    }
    play() {
        this.group = svg().append("g");
    }
    rollback() {}
}

export class TextEngine {
    static textSVG = undefined;
    static fonts = {};

    static init() {
        this.load("consolas");
        this.textSVG = svg().append("text");
        this.textSVG.setAttribute("fill-opacity", 0);
        this.textSVG.setAttribute("stroke-opacity", 0);
        this.textSVG.setAttribute("font-family", "consolas");
    }

    static load(family) {
        const url = `http://localhost:8080/${family}.ttf`;
        fetch(url)
            .then(res => res.arrayBuffer())
            .then(buffer => {
                this.fonts[family] = opentype.parse(buffer);
                this.boundingBox("hello", 100, 100, family, 30);
            });
    }

    static boundingBox(text, x, my, family, size) {
        this.textSVG.setAttribute("text", text);
        this.textSVG.setAttribute("font-size", size);
        const bbox = this.textSVG.nake().getBBox();
        return bbox;
        // const font = this.fonts[family];
        // const path = font.getPath(text, x, my, size);
        // const bbox = path.getBoundingBox();
        // return { x: bbox.x1, y: bbox.y1, width: bbox.width, height: bbox.height };
    }

    static transformPathes(group1, group2) {}
}
