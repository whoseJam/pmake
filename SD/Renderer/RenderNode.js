import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";

const SVGLabel = new Set(["circle", "ellipse", "image", "line", "path", "polygon", "rect", "text", "svg", "g", "marker", "defs"]);
const HTMLLabel = new Set(["div", "input", "button", "label"]);

export function createRenderNode(parent, render, label) {
    if (SVGLabel.has(label)) {
        return new SVGNode(parent, render, label);
    } else if (HTMLLabel.has(label)) {
        console.log("create html node");
        return new HTMLNode(parent, render, label);
    } else return new SVGNode(parent, render, label);
}

export function RenderNode(parent, render, label) {
    this.parent = parent;
    this.render = render;
    this.label = label;
}
