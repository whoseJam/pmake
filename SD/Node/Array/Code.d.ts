import { BaseArray } from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Code 组件，用于可视化展示和操作多行代码。
 * 
 * 此组件继承自 BaseArray，专门用于代码展示场景。它将每行代码视为数组中的一个元素，
 * 提供了行号显示、代码高亮等功能，适合用于算法演示和代码教学场景。
 * 
 * 特性：
 * - 自动行号：默认从 1 开始编号，符合大多数编辑器的习惯。
 * - 代码高亮：支持单行和多行区域的高亮显示。
 * - 字体控制：可调整代码字体大小，适应不同的显示需求。
 * - 自动格式化：会自动处理代码的起始和结尾空行。
 * 
 * 常见应用场景：
 * - 算法可视化教学。
 * - 代码执行过程演示。
 * - 程序调试状态展示。
 */
export class Code extends BaseArray {
    constructor(parent: SDNode | RenderNode);
    constructor(parent: SDNode | RenderNode, source: string);

    /**
     * 获取当前高亮区域的起始行号。
     * 
     * 在需要保存或同步高亮状态时很有用，例如：
     * - 在动画过程中记录当前执行位置。
     * - 与其他可视化组件同步显示状态。
     */
    l(): number;

    /**
     * 获取当前高亮区域的结束行号。
     * 
     * 通常与 l() 配合使用，用于：
     * - 确定当前高亮区域的范围。
     * - 在动画切换时保存高亮状态。
     */
    r(): number;

    /**
     * 获取代码块当前的字体大小。
     * 
     * 使用场景：
     * - 在调整布局前获取当前字体大小。
     * - 根据当前字体大小计算其他尺寸。
     * - 在保存状态时记录字体设置。
     * 
     * @returns 当前字体大小。
     */
    fontSize(): number;

    /**
     * 设置代码块的字体大小。
     * 
     * 使用场景：
     * - 使用较大字号以确保清晰可见。
     * - 使用较小字号以显示更多内容。
     * - 根据容器大小动态调整字体。
     * 
     * @param fontSize 字体大小。
     * @returns this 用于支持链式调用。
     */
    fontSize(fontSize: number): this;

    /**
     * 设置代码块的内容。
     * 
     * 此方法会自动处理代码格式，包括：
     * - 移除起始和结尾的多余空行。
     * - 保持代码的缩进结构。
     * - 自动调整显示区域。
     * 
     * @param source 源代码字符串。
     * @returns this 用于支持链式调用。
     */
    code(source: string): this;

    /**
     * 取消代码高亮显示。
     * 
     * 使用场景：
     * - 重置代码显示状态。
     * - 清除之前的高亮效果。
     * - 准备开始新的演示流程。
     * 
     * @param no 传入 false、null 或 undefined 来取消高亮。
     * @returns this 用于支持链式调用。
     */
    focus(no: false | null | undefined): this;

    /**
     * 高亮显示指定的单行代码。
     * 
     * 使用场景：
     * - 跟踪代码执行的当前位置。
     * - 突出显示关键语句。
     * - 标记程序的断点位置。
     * 
     * @param row 需要高亮显示的行号。
     * @returns this 用于支持链式调用。
     */
    focus(row: number): this;

    /**
     * 高亮显示一段连续的代码区域。
     * 
     * 使用场景：
     * - 突出显示完整的代码块（如函数或循环体）。
     * - 标记需要重点关注的代码段。
     * - 显示当前正在执行的代码范围。
     * 
     * @param l 高亮区域的起始行号。
     * @param r 高亮区域的结束行号。
     * @returns this 用于支持链式调用。
     */
    focus(l: number, r: number): this;
}
