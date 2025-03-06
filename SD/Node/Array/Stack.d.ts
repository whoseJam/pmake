import { Array } from "@/Node/Array/Array";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Stack 组件，用于创建垂直向下堆叠的元素序列。
 * 
 * 此组件继承自 Array，专门用于需要垂直向下排列且大小一致的元素序列。每个元素都被封装在
 * 一个 Box 组件中，从上往下依次堆叠，保持统一的尺寸。添加的元素会自动在其 Box 中居中显示。
 * 
 * 特性：
 * - 垂直布局：元素从上往下堆叠，符合自然阅读顺序。
 * - 统一尺寸：所有元素保持相同的宽度和高度。
 * - 自动居中：添加的元素在其容器中自动居中对齐。
 * 
 * 常见应用场景：
 * - 菜单或导航列表的垂直展示。
 * - 时间线或进度步骤的自上而下展示。
 * - 消息列表或通知的垂直排列。
 */
export class Stack extends Array {
    constructor(parent: SDNode | RenderNode);
}
