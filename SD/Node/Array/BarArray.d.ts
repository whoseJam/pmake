import { BaseArray } from "@/Node/Array/BaseArray";
import { Rect } from "@/Node/Shape/Rect";

export class BarElement extends Rect {
    text(): string;
    text(text: string): this;
    intValue(): number;
    value(): number;
    value(value: number): this;
}

export class BarArray extends BaseArray<BarElement, number> {
    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}
