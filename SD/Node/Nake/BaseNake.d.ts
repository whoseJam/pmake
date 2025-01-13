import { SDNode } from "@/Node/SDNode";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

export class BaseNake extends SDNode {
    constructor(parent: SDNode, tag: string);

    fill(): HexColor;
    fill(fill: SDColor): this;
    fillOpacity(): number;
    fillOpacity(opacity: number): this;
    stroke(): HexColor;
    stroke(stroke: SDColor): this;
    strokeOpacity(): number;
    strokeOpacity(opacity: number): this;
    strokeWidth(): number;
    strokeWidth(width: number): this;
    strokeDashOffset(): number;
    strokeDashOffset(offset: number): this;
    strokeDashArray(): Array<number>;
    strokeDashArray(array: Array<number>): this;
    color(): PacketColor;
    color(color: SDColor): this;
}
