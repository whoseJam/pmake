import { Array } from "@/Node/Array";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Pile 组件
 *
 * 此组件的每个元素都是一个 Box 组件，且从下往上排列，形成序列的结构，每个元素拥有相同的长宽
 *
 * 在向此组件添加价值物的时候，价值物默认会被放置在 Box 中的居中位置
 */
export class Pile extends Array {
    constructor(parent: SDNode | RenderNode);
}
