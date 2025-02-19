import { Array } from "@/Node/Array";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 栈型数组组件
 * 
 * 数组的每个元素都是一个 Box 组件，且从上往下排列
 */
export class Stack extends Array {
    constructor(parent: SDNode | RenderNode);
}
