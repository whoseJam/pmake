import { SD2DNode } from "@/Nod/SD2DNode";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Box } from "@/Node/Element/Box";

export class Pile<E = Box, V = SD2DNode> extends BaseArray<E, V> {
    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}
