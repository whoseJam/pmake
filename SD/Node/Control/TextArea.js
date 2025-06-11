import { BaseControl } from "@/Node/Control/BaseControl";
import { getTargetLayer } from "@/Node/SDNode";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";

export class TextArea extends BaseControl {
    constructor(target) {
        const targetLayer = getTargetLayer(target);
        if (targetLayer instanceof HTMLNode) {
            const { TextAreaHTML } = require("@/Node/HTML/Control/TextAreaHTML");
            return new TextAreaHTML(target);
        } else {
            const { TextAreaSVG } = require("@/Node/SVG/Control/TextAreaSVG");
            return new TextAreaSVG(target);
        }
    }
}
