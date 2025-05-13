import { EllipseHTML } from "@/Node/HTML/Shape/EllipseHTML";
import { getTargetLayer } from "@/Node/SDNode";
import { EllipseSVG } from "@/Node/SVG/Shape/EllipseSVG";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export function Ellipse(target) {
    const targetLayer = getTargetLayer(target);
    if (targetLayer instanceof HTMLNode) {
        return new EllipseHTML(target);
    } else {
        return new EllipseSVG(target);
    }
}

Ellipse.prototype = {
    toPolygon() {
        ErrorLauncher.notImplementedYet("toPolygon", this.type());
    },
};
