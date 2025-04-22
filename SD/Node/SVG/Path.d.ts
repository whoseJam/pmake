import { SDNode } from "@/Node/SDNode";
import { BaseSVGLine } from "@/Node/SVG/BaseSVGLine";
import { RenderNode } from "@/Renderer/RenderNode";

export class Path extends BaseSVGLine {
    constructor(target: SDNode | RenderNode);
    d(): string;
    d(d: string): this;
}
