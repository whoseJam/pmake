import { Array } from "@/Node/Array/Array";
import { SD2DNode } from "@/Node/SD2DNode";

type Align = "y" | "cy" | "my";

export class ValueArray extends Array<SD2DNode, SD2DNode> {
    align(): Align;
    align(align: Align): this;
}
