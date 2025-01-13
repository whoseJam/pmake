import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";

const SVGLabel = new Set(["rect"]);
const HTMLLabel = new Set(["svg"]);

export function createRenderNode(parent, render, label) {
    if (label in SVGLabel) {
        return new SVGNode(parent, render, label);
    } else if (label in HTMLLabel) {
        return new HTMLNode(parent, render, label);
    } else return new SVGNode(parent, render, label);
}

export function RenderNode(parent, render, label) {
    this.parent = parent;
    this.render = render;
    this.label = label;
}
