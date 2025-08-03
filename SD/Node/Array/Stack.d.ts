import { Box } from "@/Nod/Box";
import { BaseArray } from "@/Node/Array/BaseArray";
import { SD2DNode } from "@/Node/SD2DNode";

export class Stack<E = Box, V = SD2DNode> extends BaseArray<E, V> {
    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}
