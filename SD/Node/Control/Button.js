import { BaseControl } from "@/Node/Control/BaseControl";
import { getTargetLayer } from "@/Node/SDNode";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export class Button extends BaseControl {
    constructor(target) {
        const targetLayer = getTargetLayer(target);
        if (targetLayer instanceof HTMLNode) {
            const { ButtonHTML } = require("@/Node/HTML/Control/ButtonHTML");
            return new ButtonHTML(target);
        } else {
            const { ButtonSVG } = require("@/Node/SVG/Control/ButtonSVG");
            return new ButtonSVG(target);
        }
    }
}
