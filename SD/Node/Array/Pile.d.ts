import { Array } from "@/Node/Array";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Pile 组件，用于创建垂直堆叠的元素序列。
 * 
 * 此组件继承自 Array，专门用于需要垂直排列且大小一致的元素序列。每个元素都被封装在
 * 一个 Box 组件中，从下往上依次堆叠，保持统一的尺寸。添加的元素会自动在其 Box 中居中显示。
 * 
 * 特性：
 * - 垂直布局：元素从下往上堆叠，符合堆栈的直观表现。
 * - 统一尺寸：所有元素保持相同的宽度和高度。
 * - 自动居中：添加的元素在其容器中自动居中对齐。
 * 
 * 常见应用场景：
 * - 栈结构的可视化展示。
 * - 历史记录或操作步骤的垂直展示。
 * - 弹出式菜单或通知的堆叠显示。
 */
export class Pile extends Array {
    constructor(parent: SDNode | RenderNode);
}
