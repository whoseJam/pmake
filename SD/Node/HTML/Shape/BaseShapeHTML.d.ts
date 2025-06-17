import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDColor } from "@/Utility/Color";

export class BaseShapeHTML extends BaseHTML {
    constructor(target: SDNode | RenderNode, label: string);
    fill(): string;
    fill(fill: SDColor | string): this;
    stroke(): string;
    stroke(stroke: SDColor | string): this;
    strokeWidth(): number;
    strokeWidth(width: number): this;
    color(): SDColor;
    color(color: SDColor | string): this;
}
