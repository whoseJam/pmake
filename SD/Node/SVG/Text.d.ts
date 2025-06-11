import { SDNode } from "@/Node/SDNode";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { RenderNode } from "@/Renderer/RenderNode";

export class Text extends BaseSVG {
    constructor(target: SDNode | RenderNode, text?: number | string);
    fontSize(): number;
    fontSize(fontSize: number): this;
    text(): string;
    text(text: string): this;
}
