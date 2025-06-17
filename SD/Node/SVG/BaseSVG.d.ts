import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDColor } from "@/Utility/Color";

export class BaseSVG extends SD2DNode {
    constructor(target: SDNode | RenderNode, tag: string);

    fill(): string;
    fill(fill: SDColor | string): this;
    fillOpacity(): number;
    fillOpacity(opacity: number): this;
    stroke(): string;
    stroke(stroke: SDColor | string): this;
    strokeOpacity(): number;
    strokeOpacity(opacity: number): this;
    strokeWidth(): number;
    strokeWidth(width: number): this;
    strokeDashOffset(): number;
    strokeDashOffset(offset: number): this;
    strokeDashArray(): Array<number>;
    strokeDashArray(array: Array<number>): this;
    color(): SDColor;
    color(color: SDColor | string): this;
}
