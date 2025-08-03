import { Pile } from "@/Node/Array/Pile";
import { SD2DNode } from "@/Node/SD2DNode";

type Align = "x" | "cx" | "mx";
type Justify = "y" | "cy" | "my";

export class ValuePile extends Pile<SD2DNode, SD2DNode> {
    align(): Align;
    align(align: Align): this;
    justify(): Justify;
    justify(justify: Justify): this;
}
