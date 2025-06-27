import { Action } from "@/Animate/Action";
import { div, svg } from "@/Interact/Root";
import { SDNode } from "@/Node/SDNode";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export const SVGLabel = new Set(["circle", "ellipse", "image", "line", "path", "polygon", "rect", "text", "svg", "g", "marker", "defs"]);
export const HTMLLabel = new Set(["div", "input", "button", "textarea", "img"]);

function treeStructureChange(render: RenderNode, owner: SDNode) {
    return function (t: number) {
        if (this.target) {
            // append a render node
            if (t !== 1) return;
            this.target.append(render);
            // @ts-ignore
            owner._.created = true;
            requestAnimationFrame(() => {
                owner._.ready = true;
            });
        } else {
            // remove a render node
            if (t !== 0) return;
            render.nake().remove();
            // @ts-ignore
            owner._.created = false;
            requestAnimationFrame(() => {
                owner._.ready = false;
            });
        }
    };
}

export function createRenderNode(parent: SDNode, render: RenderNode, label: string) {
    const { HTMLNode } = require("@/Renderer/HTML/HTMLNode");
    const { SVGNode } = require("@/Renderer/SVG/SVGNode");
    if (SVGLabel.has(label)) {
        if (SVGLabel.has(render.label)) {
            return new SVGNode(parent, render, label);
        } else {
            return new SVGNode(parent, svg(), label);
        }
    } else if (HTMLLabel.has(label)) {
        if (HTMLLabel.has(render.label)) {
            return new HTMLNode(parent, render, label);
        } else {
            return new HTMLNode(parent, div(), label);
        }
    } else return new SVGNode(parent, render, label);
}

export function createHtmlNodeOnForeignObject(parent: SDNode, render: RenderNode, label: string) {
    return new HTMLNode(parent, render, label);
}

export class RenderNode {
    parent: SDNode;
    render: RenderNode;
    label: string;
    element: Element;
    class: typeof HTMLNode | typeof SVGNode;
    constructor(container: Element);
    constructor(parent: SDNode | undefined, render: RenderNode | undefined, label: string);
    constructor(arg0: Element | SDNode | undefined, arg1?: RenderNode | undefined, arg2?: string) {
        if (arg0 instanceof Element) {
            this.element = arg0;
        } else {
            this.parent = arg0;
            this.render = arg1;
            this.label = arg2;
            this.element = undefined;
        }
    }

    nake() {
        return this.element;
    }

    append(element: string | RenderNode) {
        const child: RenderNode = typeof element === "string" ? new this.class(this.parent, this, element) : element;
        this.appendNake(child.nake());
        return child;
    }

    appendNake(element: Element) {
        this.nake().append(element);
    }

    moveTo(render: RenderNode) {
        ErrorLauncher.notImplementedYet("moveTo");
    }

    appear() {
        if (this.parent === undefined) {
            this.render.append(this);
            return;
        }
        if (this.parent.delay) {
            const l = this.parent.delay();
            const r = this.parent.delay() + this.parent.duration();
            new Action(l, r, undefined, this.render, treeStructureChange(this, this.parent), this, "appear");
            new Action(l, r, 0, 1, () => {}, this.parent, "opacity");
        } else {
            const t = 0;
            new Action(t, t, undefined, this.render, treeStructureChange(this, this.parent), this, "appear");
            new Action(t, t, 0, 1, () => {}, this.parent, "opacity");
        }
    }

    remove() {
        const t = this.parent.delay() + this.parent.duration();
        new Action(t, t, this.render, undefined, treeStructureChange(this, this.parent), this, "remove");
    }

    getAttribute(key) {
        ErrorLauncher.notImplementedYet("getAttribute");
    }

    setAttribute(key, value) {
        ErrorLauncher.notImplementedYet("setAttribute");
    }

    hasShape() {
        return true;
    }
}
