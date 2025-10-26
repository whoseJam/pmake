import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { Rect } from "@/Node/Shape/Rect";
import { RenderNode } from "@/Renderer/RenderNode";
import { Color as C } from "@/Utility/Color";

const BASE_CONTROL_ATTRIBUTES = {
    "fill": C.white,
    "stroke": C.black,
    "strokeWidth": 1,
    "width": "100%",
    "height": "100%",
    "border-style": "solid",
};

export class BaseControl extends SDSVGNode {
    constructor(target: SDNode | RenderNode) {
        super(target);
    }
    x(x?: number) {
        return Rect.prototype.x.apply(this, arguments);
    }
    y(y?: number) {
        return Rect.prototype.y.apply(this, arguments);
    }
    width(width?: number) {
        return Rect.prototype.width.apply(this, arguments);
    }
    height(height?: number) {
        return Rect.prototype.height.apply(this, arguments);
    }
    __createHTMLNode(label: string, width: number, height: number, attributes: { [key: string]: any }): RenderNode {
        this.vars.merge(attributes);
        const foreign = this.__createSVGNode("foreignObject", {
            x: 0,
            y: 0,
            width,
            height,
        });
        const attributes_ = {
            ...BASE_CONTROL_ATTRIBUTES,
            ...(attributes || {}),
        };
        const object = RenderNode.createRenderNode(this, foreign, label);
        const attributeMap = {
            fill: ["background-color", Interp.colorInterp],
            stroke: ["border-color", Interp.colorInterp],
            strokeWidth: ["border-width", Interp.pixelInterp],
            text: ["text", Interp.stringInterp],
            min: ["min", Interp.numberInterp],
            max: ["max", Interp.numberInterp],
            value: ["value", typeof attributes_["value"] === "string" ? Interp.stringInterp : Interp.numberInterp],
        };
        for (const key in attributes_) {
            if (!attributeMap[key]) {
                object.setAttribute(key, attributes_[key]);
                continue;
            }
            const [aliasKey, interp] = attributeMap[key];
            const watchCallback = SDNode.__action(this, object, aliasKey, interp);
            this.vars.watch(key, watchCallback);
            object.setAttribute(aliasKey, attributes_[key]);
        }
        return object;
    }
}
