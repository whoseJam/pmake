import { SDNode } from "@/Node/SDNode";
import { SDRule } from "@/Rule/Rule";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

export class BaseElement extends SDNode {
    constructor(parent: SDNode);

    rate(): number;
    rate(rate: number): this;

    color(color: SDColor): this;
    color(): PacketColor;
    fill(): HexColor;
    fill(fill: HexColor): this;
    fillOpacity(): number;
    fillOpacity(opacity: number): this;
    stroke(): HexColor;
    stroke(stroke: HexColor): this;
    strokeOpacity(): number;
    strokeOpacity(opacity: number): this;
    strokeWidth(): number;
    strokeWidth(width: number): this;

    background(): SDNode;

    text(): string;
    drop(): this;
    intValue(): number;
    value(): SDNode;
    value(value: SDNode): this;
    value(value: SDNode, rule: SDRule): this;
    valueFromExist(value: SDNode): this;
}