import { SDNode } from "@/Node/SDNode";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

export class TeXAtom {
    constructor(parent: SDNode);

    fill(): HexColor;
    fill(fill: SDColor): this;
    stroke(): HexColor;
    stroke(stroke: SDColor): this;
    color(): PacketColor;
    color(color: SDColor): this;
}
