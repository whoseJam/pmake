import { Array } from "@/Node/Array/Array";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type Align = "y" | "cy" | "my";

/**
 * ValueArray 组件，用于创建灵活的水平元素序列布局。
 * 
 * 此组件继承自 Array，专门用于处理不同类型和大小的元素序列。每个元素可以是任意的
 * SDNode 组件，从左往右排列。与其他数组组件不同，ValueArray 不限制元素的尺寸，
 * 但会统一管理元素之间的间距，确保布局的整齐性。
 * 
 * 特性：
 * - 灵活元素：支持任意 SDNode 类型的元素。
 * - 自由尺寸：不限制元素的宽度和高度。
 * - 间距管理：自动处理元素之间的间隔。
 * - 垂直对齐：支持多种垂直对齐方式。
 * 
 * 常见应用场景：
 * - 混合内容的导航菜单。
 * - 工具栏或操作按钮组。
 * - 不同大小元素的展示。
 * - 自定义表单控件的布局。
 */
export class ValueArray extends Array {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取当前的垂直对齐方式。
     * 
     * 使用场景：
     * - 在调整布局前获取当前对齐设置。
     * - 根据当前对齐方式计算元素位置。
     * - 在保存布局状态时记录对齐设置。
     * 
     * @returns 当前的对齐方式（"y"、"cy" 或 "my"）。
     */
    align(): Align;

    /**
     * 设置元素的垂直对齐方式。
     * 
     * 提供三种对齐选项：
     * - "y"：元素顶部对齐，适合统一起始位置的布局。
     * - "cy"：元素中线对齐，创建视觉上的平衡感。
     * - "my"：元素底部对齐，适合不同高度元素的基线对齐。
     * 
     * 使用场景：
     * - 使用中线对齐创建整齐的外观。
     * - 使用顶部对齐保持整洁的布局。
     * - 使用底部对齐处理不同高度的元素。
     * 
     * @param align 要设置的对齐方式。
     * @returns this 用于支持链式调用。
     */
    align(align: Align): this;
}
