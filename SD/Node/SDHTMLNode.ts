import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/SDNode";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Color as C } from "@/Utility/Color";

const BASE_HTML_ATTRIBUTES = {
    "fill": C.white,
    "stroke": C.black,
    "strokeWidth": 1,
    "width": "98%",
    "height": "98%",
    "border-style": "solid",
};

export abstract class SDHTMLNode extends SDSVGNode {
    /**
     * Creates an HTML node wrapped in a foreignObject element.
     * @param label - The HTML element tag name
     * @param width - The width of the foreignObject container
     * @param height - The height of the foreignObject container
     * @param attributes - Additional attributes to apply to the HTML element
     * @returns The created RenderNode
     */
    __createHTMLNode(label: string, width: number, height: number, attributes: Record<string, any> = {}): RenderNode {
        this.vars.merge(attributes);
        const foreign = this.__createSVGNode("foreignObject", {
            x: 0,
            y: 0,
            width,
            height,
        });
        const attributes_ = {
            ...BASE_HTML_ATTRIBUTES,
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
