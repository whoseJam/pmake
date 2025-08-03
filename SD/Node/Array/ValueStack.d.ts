import { Stack } from "@/Node/Array/Stack";
import { SD2DNode } from "@/Node/SD2DNode";

type Align = "x" | "cx" | "mx";
type Justify = "y" | "cy" | "my";

export class ValueStack extends Stack<SD2DNode, SD2DNode> {
    align(): Align;
    align(align: Align): this;
    justify(): Justify;
    justify(justify: Justify): this;
}
