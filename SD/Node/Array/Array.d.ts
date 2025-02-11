import { BaseArray } from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";

export class Array extends BaseArray {
    constructor(parent: SDNode);

    /**
     * 获取数组每个元素的宽度
     */
    elementWidth(): number;

    /**
     * 设置数组每个元素的宽度
     * @param width
     */
    elementWidth(width: number): this;

    /**
     * 获取数组每个元素的高度
     */
    elementHeight(): number;

    /**
     * 设置数组每个元素的高度
     * @param height
     */
    elementHeight(height: number): this;
}
