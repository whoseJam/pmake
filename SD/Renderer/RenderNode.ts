import { Action } from "@/Animate/Action";
import { Dom } from "@/Dom/Dom";
import { SDNode } from "@/Node/SDNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

const INNER_HTML_KEY = new Set(["innerHTML", "text"]);
const STYLE_KEY = new Set(["pointer-events", "min-width", "min-height", "display"]);
const SHAPE_KEY = new Set([
    // shape key
    "circle",
    "ellipse",
    "foreignObject",
    "fragment",
    "image",
    "line",
    "path",
    "rect",
    "svg",
    "text",
    "polygon",
    "polyline",
]);
const HTML_KEY = new Set([
    // html key
    "div",
    "input",
    "button",
    "textarea",
]);

function parseText(text: string) {
    let ans = "";
    text = String(text);
    for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") ans += "&emsp;";
        else if (text[i] === "<") ans += "&lt;";
        else if (text[i] === ">") ans += "&gt;";
        else ans += text[i];
    }
    return ans;
}

interface RenderNodeParams {
    targetNode?: SDNode;
    targetLayer?: RenderNode;
    label?: string;
    element?: Element;
    append?: boolean;
    action?: boolean;
}

export class RenderNode {
    targetNode: SDNode;
    targetLayer: RenderNode;
    label: string;
    backingElement: Element;
    constructor(args: RenderNodeParams) {
        if (args.action === undefined) args.action = true;
        if (args.append === undefined) args.append = true;
        if (!args.element) {
            if (!args.label) ErrorLauncher.whatHappened();
            if (HTML_KEY.has(args.label)) args.element = Dom.createElement(args.label);
            else args.element = Dom.createSVGElement(args.label);
        } else args.label = Dom.tagName(args.element);
        this.targetNode = args.targetNode;
        this.label = args.label;
        this.backingElement = args.element;
        if (!args.append) return;
        if (!args.targetLayer) ErrorLauncher.whatHappened();
        if (!args.action) {
            this.targetLayer = args.targetLayer;
            args.targetLayer.__append(this);
        } else args.targetLayer.append(this);
    }
    delay() {
        return this.targetNode.delay();
    }
    duration() {
        return this.targetNode.duration();
    }
    element() {
        return this.backingElement;
    }
    __append(element_: Element | RenderNode) {
        const element = element_ instanceof RenderNode ? element_.element() : element_;
        this.element().append(element);
        return this;
    }
    __remove() {
        this.element().remove();
        return this;
    }
    __removeChild(element_: Element | RenderNode) {
        const element = element_ instanceof RenderNode ? element_.element() : element_;
        this.element().removeChild(element);
        return this;
    }
    append(element: string | RenderNode): RenderNode {
        if (element instanceof RenderNode) return element.moveTo(this);
        return new RenderNode({
            targetNode: this.targetNode,
            targetLayer: this,
            label: element,
        });
    }
    moveTo(targetLayer: RenderNode) {
        if (this.targetLayer === targetLayer) return;
        const l = this.delay();
        const r = this.delay() + this.duration();
        const this_ = this;
        function structure(t: number) {
            if (this.source && this.target) {
                if (!this.reverse && t === 1) this.target.__append(this_); // moveTo
                if (this.reverse && t === 0) this.target.__append(this_); // moveTo reverse
            } else if (this.source && !this.target) {
                if (!this.reverse && t === 1) this_.__remove(); // remove
                if (this.reverse && t === 0) this_.__remove(); // appear reverse
            } else if (!this.source && this.target) {
                if (!this.reverse && t === 1) this.target.__append(this_); // appear
                if (this.reverse && t === 0) this.target.__append(this_); // remove reverse
            }
        }
        new Action(l, r, this.targetLayer, targetLayer, structure, this, "moveTo");
        this.targetLayer = targetLayer;
        return this;
    }
    remove() {
        return this.moveTo(undefined);
    }
    getAttribute(key: string) {
        const element = this.element() as SVGElement;
        if (INNER_HTML_KEY.has(key)) {
            return element.innerHTML;
        } else if (STYLE_KEY.has(key)) {
            return element.style[key];
        }
        return element.getAttribute(key);
    }
    setAttribute(key: string, value: any) {
        const element = this.element() as SVGElement;
        if (value && typeof value.r === "number" && typeof value.g === "number" && typeof value.b === "number") value = `rgb(${value.r}, ${value.g}, ${value.b})`;
        if (INNER_HTML_KEY.has(key)) {
            if (key === "text") value = parseText(value);
            element.innerHTML = value;
        } else if (STYLE_KEY.has(key)) {
            element.style[key] = value;
        } else if (key === "viewBox" && typeof value === "object") {
            element.setAttribute(key, `${value.x} ${value.y} ${value.width} ${value.height}`);
        } else {
            element.setAttribute(key, value);
        }
    }
    hasShape() {
        return SHAPE_KEY.has(this.label);
    }
    static getDocumentBodyRenderNode() {
        return new RenderNode({
            targetNode: null,
            targetLayer: null,
            element: document.body,
            append: false,
            action: false,
        });
    }
    static createRenderNodeWithoutAction(targetNode: SDNode, targetLayer: RenderNode, label: string) {
        return new RenderNode({
            targetNode,
            targetLayer,
            label,
            action: false,
        });
    }
    static createRenderNode(targetNode: SDNode, targetLayer: RenderNode, label: string) {
        return new RenderNode({
            targetNode,
            targetLayer,
            label,
        });
    }
}
