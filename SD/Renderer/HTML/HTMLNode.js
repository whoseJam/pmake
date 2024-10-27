import { Dom } from "@/Dom/Dom";

export class HTMLNode {
    constructor(parent, layer, tag) {
        this.parent = parent;
        this.layer = layer;
        if (typeof(tag) === "string") {
            this.element = Dom.createElement(tag);
            this.layer.append(this.nake());
        } else {
            this.element = tag;
        }
    }

    nake() {
        return this.element;
    }

    append(tag) {
        const result = new HTMLNode(this.parent, this.layer, tag);
        this.nake().append(result.nake());
        return result;
    }

    moveTo() {
        throw new Error("Not Implemented Yet");
    }

    appear() {
        throw new Error("Not Implemented Yet");
    }

    remove() {
        throw new Error("Not Implemented Yet");
    }

    setAttribute(key, value) {
        if (key === "innerHTML") {
            this.element.innerHTML = value;
        } else if (key === "pointer-events") {
            this.element.style[key] = value;
        } else {
            this.element.setAttribute(key, value);
        }
    }
}