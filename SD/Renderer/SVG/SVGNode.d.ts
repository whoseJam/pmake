import { SDNode }     from "@/Node/SDNode";
import { RenderNode } from "SD/Renderer/RenderNode";

export class SVGNode extends RenderNode {
    constructor(parent: SDNode, layer: RenderNode, tag: string);

    nake(): SVGElement;
    append(tag: string): SVGNode;
    moveTo(layer: RenderNode);
    appear();
    remove();
    setAttribute(key: string, value: any);
}