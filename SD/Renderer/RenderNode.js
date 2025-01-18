import { div, svg, three } from "@/Interact/Root";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";
import { ThreeNode } from "@/Renderer/Three/ThreeNode";

const SVGLabel = new Set(["circle", "ellipse", "image", "line", "path", "polygon", "rect", "text", "svg", "g", "marker", "defs"]);
const HTMLLabel = new Set(["div", "input", "button", "label", "textarea"]);
const ThreeLabel = new Set(["three", "coord3d", "cube"]);

export function createRenderNode(parent, render, label) {
    if (SVGLabel.has(label)) {
        if (SVGLabel.has(render.label)) {
            return new SVGNode(parent, render, label);
        } else {
            return new SVGNode(parent, svg(), label);
        }
    } else if (HTMLLabel.has(label)) {
        if (HTMLLabel.has(render.label)) {
            return new HTMLNode(parent, render, label);
        } else {
            return new HTMLNode(parent, div(), label);
        }
    } else if (ThreeLabel.has(label)) {
        if (ThreeLabel.has(render.label)) {
            return new ThreeNode(parent, render, label);
        } else {
            return new ThreeNode(parent, three(), label);
        }
    } else return new SVGNode(parent, render, label);
}

export function RenderNode(parent, render, label) {
    this.parent = parent;
    this.render = render;
    this.label = label;
}
