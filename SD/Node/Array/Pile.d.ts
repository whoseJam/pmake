import { Array } from "@/Node/Array";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 堆型数组组件
 * 
 * 数组的每个元素都是一个 Box 组件，且从下往上排列
 */
export class Pile extends Array {
    constructor(parent: SDNode | RenderNode);
}
