import { Stack } from "@/Node/Array/Stack";
import { SDNode } from "@/Node/SDNode";

type Align = "x" | "cx" | "mx";

export class ValueStack extends Stack {
    constructor(parent: SDNode);

    align(): Align;
    align(align: Align): this;
}
