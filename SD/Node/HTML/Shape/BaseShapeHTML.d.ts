import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { PacketColor, SDColor } from "@/Utility/Color";

export class BaseShapeHTML extends BaseHTML {
    fill(): SDColor;
    fill(fill: SDColor): this;
    stroke(): SDColor;
    stroke(stroke: SDColor): this;
    strokeWidth(): number;
    strokeWidth(width: number): this;
    color(): PacketColor;
    color(color: SDColor): this;
}
