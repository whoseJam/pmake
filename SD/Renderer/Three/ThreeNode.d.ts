import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Node/RenderNode";

export class ThreeNode extends RenderNode {
    constructor(parent: SDNode, layer: RenderNode, label: string);

    nake(): any;
    append(tag: string): ThreeNode;
    moveTo(layer: RenderNode): void;
    appear(): void;
    remove(): void;
    setAttribute(key: string, value: any): void;
    getAttribute(key: string): any
}