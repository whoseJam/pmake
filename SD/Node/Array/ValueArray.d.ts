import { Array } from "@/Node/Array/Array";
import { SD2DNode } from "@/Node/SD2DNode";

type Align = "y" | "cy" | "my";
type Justify = "x" | "cx" | "mx";

export class ValueArray extends Array<SD2DNode, SD2DNode> {
    align(): Align;
    align(align: Align): this;
    justify(): Justify;
    justify(justify: Justify): this;
}
