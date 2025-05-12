import { RectHTML } from "@/Node/HTML/Shape/RectHTML";
import { getTargetLayer } from "@/Node/SDNode";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { RectSVG } from "@/Node/SVG/RectSVG";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export function Rect(target) {
    const targetLayer = getTargetLayer(target);
    if (targetLayer instanceof HTMLNode) {
        return new RectHTML(target);
    } else {
        return new RectSVG(target);
    }
}

Rect.prototype = {
    ...BaseShape.prototype,
};
