import { SD2DNode } from "@/Node/SD2DNode";
import { SDColor } from "@/Utility/Color";

export class BaseText extends SD2DNode {
    constructor(target: SDNode | RenderNode, text?: number | string);
    fontSize(): number;
    fontSize(fontSize: number): this;
    text(): string;
    text(text: string): this;
    fill(): string;
    fill(fill: string): this;
    stroke(): string;
    stroke(stroke: string): this;
    color(): SDColor;
    color(color: string | SDColor): this;
}
