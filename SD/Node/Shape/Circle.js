import { CircleHTML } from "@/Node/HTML/Shape/CircleHTML";
import { getTargetLayer } from "@/Node/SDNode";
import { CircleSVG } from "@/Node/SVG/Shape/CircleSVG";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export function Circle(target) {
    const targetLayer = getTargetLayer(target);
    if (targetLayer instanceof HTMLNode) {
        return new CircleHTML(target);
    } else {
        return new CircleSVG(target);
    }
}
