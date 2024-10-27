import { SDNode }     from "@/Node/SDNode";
import { RenderNode } from "SD/Renderer/RenderNode";

export class SVGNode extends RenderNode {
    constructor(parent: SDNode, layer: RenderNode, tag: string);

    nake(): SVGElement;
    append(tag: string): SVGNode;
    moveTo(layer: RenderNode): void;
    appear(): void;
    remove(): void;
    setAttribute(key: string, value: any): void;
    getAttribute(key: string): any;
}