import { SDNode } from "@/Node/SDNode";

export class RenderNode {
    constructor(parent: SDNode, layer: RenderNode, tag: string);

    nake(): Element;
    append(tag: string): RenderNode;
    moveTo(layer: RenderNode);
    appear();
    remove();
    setAttribute(key: string, value: any);
    getParent(): SDNode;
}