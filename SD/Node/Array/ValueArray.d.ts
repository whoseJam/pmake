import { Array } from "@/Node/Array/Array";
import { SDNode } from "@/Node/SDNode";

type Align = "y" | "cy" | "my";

export class ValueArray extends Array {
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
