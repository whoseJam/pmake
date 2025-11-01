import { Action } from "@/Animate/Action";
import { Dom } from "@/Dom/Dom";
import { SDNode } from "@/Node/SDNode";
import { HTML, HTML_INNERHTML_SET, HTML_STYLE_SET } from "@/Renderer/HTML";
import { SVG } from "@/Renderer/SVG";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

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
            if (HTML[args.label]) args.element = Dom.createElement(args.label);
            else args.element = Dom.createSVGElement(args.label);
        } else args.label = Dom.tagName(args.element);
        this.targetNode = args.targetNode;
        this.label = args.label;
        this.backingElement = args.element;
        if (!args.append) return;
        if (!args.targetLayer) return;
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
        const element = this.element() as SVGElement | HTMLElement;
        if (HTML_INNERHTML_SET.has(key)) return element.innerHTML;
        else if (this.isHTML() && HTML_STYLE_SET.has(key)) return element.style[key];
        return element.getAttribute(key);
    }
    setAttribute(key: string, value: any) {
        value = RenderNode.__asValue(value);
        const element = this.element() as SVGElement | HTMLElement;
        if (HTML_INNERHTML_SET.has(key)) {
            if (key === "text") value = parseText(value);
            element.innerHTML = value;
        } else if (this.isHTML() && HTML_STYLE_SET.has(key)) element.style[key] = value;
        else element.setAttribute(key, value);
    }
    hasShape() {
        return SVG[this.label]?.hasShape;
    }
    isSVG() {
        return SVG[this.label] !== undefined;
    }
    isHTML() {
        return !this.isSVG();
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
    __injectCSS(css: { [key: string]: string }) {
        Object.keys(css).forEach(key => {
            (this.element() as HTMLElement).style[key] = css[key];
        });
    }
    static __asValue(value: any) {
        if (value && typeof value.r === "number" && typeof value.g === "number" && typeof value.b === "number")
            return `rgb(${value.r}, ${value.g}, ${value.b})`;
        if (
            value &&
            typeof value.x === "number" &&
            typeof value.y === "number" &&
            typeof value.width === "number" &&
            typeof value.height === "number"
        )
            return `${value.x} ${value.y} ${value.width} ${value.height}`;
        return value;
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
    static createMathRenderNode(targetNode: SDNode, targetLayer: RenderNode, element: Element) {
        const { TextEngine } = require("@/Node/Text/TextEngine");
        const math = new RenderNode({
            targetNode,
            targetLayer,
            element,
            action: false,
        });
        TextEngine.adjustMath(math);
        return math;
    }
    /**
     * The method will clone a math render node. The result math render node will not be appended to
     * the layer instantly. It will be appended by the blank node interpolation defined on 'math'.
     * @param math - The math render node to be cloned.
     */
    static cloneMathRenderNode(math: RenderNode) {
        console.log("clone element=", math.element());
        const element = Dom.deepClone(math.element());
        console.log("after clone element=", element);
        const math_ = new RenderNode({
            targetNode: math.targetNode,
            targetLayer: math.targetLayer,
            element,
            append: false,
            action: false,
        });
        return math_;
    }
    static createRenderNode(targetNode: SDNode, targetLayer: RenderNode, label: string) {
        return new RenderNode({
            targetNode,
            targetLayer,
            label,
        });
    }
}
