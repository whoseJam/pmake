import { SDNode }     from "@/Node/SDNode";

import { RenderNode } from "@/Renderer/RenderNode";

export class HTMLNode extends RenderNode {
    constructor(parent: SDNode, layer: RenderNode);

    nake(): HTMLElement;
    append(tag: string): HTMLNode;
    moveTo(layer: RenderNode);
    appear();
    remove();
    setAttribute(key: string, value: any);
}