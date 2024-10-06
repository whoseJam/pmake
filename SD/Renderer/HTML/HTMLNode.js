import { Dom } from "@/Dom/Dom";

export class HTMLNode {
    constructor(parent, layer, tag) {
        this.parent = parent;
        this.layer = layer;
        this.element = Dom.createElement(tag);
        this.layer.append(this.element);
    }
}