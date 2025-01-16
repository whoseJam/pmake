import { Dom } from "@/Dom/Dom";
import { RenderNode } from "@/Renderer/RenderNode";

const styleKey = new Set(["position", "left", "top", "pointer-events", "width", "height", "border", "overflow", "transform", "opacity"]);

export function HTMLNode(parent, render, label) {
    RenderNode.call(this, parent, render, label);
    if (typeof label === "string") {
        this.element = Dom.createElement(label);
    } else {
        this.element = label;
        this.label = Dom.tagName(label);
    }
    if (!render) document.body.append(this.element);
    else if (render.nake) render.append(this);
    else render.append(this.element);
}

HTMLNode.prototype = {
    ...HTMLNode.prototype,
    nake: function () {
        return this.element;
    },
    append(label) {
        if (label.nake) {
            this.nake().append(label.nake());
            return label;
        } else {
            const child = new HTMLNode(this.parent, this, label);
            this.nake().append(child.nake());
            return child;
        }
    },
    moveTo(render) {
        render.append(this.nake());
        this.render = render;
    },
    appear() {
        throw new Error("Not Implemented Yet");
    },
    remove() {
        this.element.remove();
    },
    getAttribute(key) {
        if (key === "innerHTML") {
            return this.element.innerHTML;
        } else if (key === "value") {
            return this.element.value;
        } else if (styleKey.has(key)) {
            return this.element.style[key];
        } else {
            return this.element.getAttribute(key);
        }
    },
    setAttribute(key, value) {
        if (key === "innerHTML") {
            this.element.innerHTML = value;
        } else if (key === "value") {
            this.element.value = value;
        } else if (styleKey.has(key)) {
            this.element.style[key] = value;
        } else {
            this.element.setAttribute(key, value);
        }
    },
    hasShape() {
        return true;
    },
};
