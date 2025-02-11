import { Stack } from "@/Node/Array/Stack";
import { SDNode } from "@/Node/SDNode";

type Align = "x" | "cx" | "mx";

export class ValueStack extends Stack {
    constructor(parent: SDNode);

    /**
     * 获取价值物数组的对齐方式
     */
    align(): Align;

    /**
     * 设置价值物数组的对齐方式
     * @param align
     */
    align(align: Align): this;
}
