import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class TextSVG extends Text {
    constructor(target: SDNode | RenderNode, text?: number | string);
    fontSize(): number;
    fontSize(fontSize: number): this;
    text(): string;
    text(text: string): this;
}
