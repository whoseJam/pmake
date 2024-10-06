import { SDNode }     from "@/Node/SDNode";
import { RenderNode } from "@/Node/RenderNode";

export class SVGNode extends RenderNode {
    constructor(parent: SDNode, layer: RenderNode, tag: string);

    moveTo(layer: RenderNode);
    appear();
    remove();
    setAttribute(key: string, value: any);
}