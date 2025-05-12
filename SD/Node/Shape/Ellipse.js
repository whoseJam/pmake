import { EllipseHTML } from "@/Node/HTML/Shape/EllipseHTML";
import { getTargetLayer } from "@/Node/SDNode";
import { EllipseSVG } from "@/Node/SVG/EllipseSVG";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export function Ellipse(target) {
    const targetLayer = getTargetLayer(target);
    if (targetLayer instanceof HTMLNode) {
        return new EllipseHTML(target);
    } else {
        return new EllipseSVG(target);
    }
}
