import { Stack } from "@/Node/Array/Stack";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type Align = "x" | "cx" | "mx";

/**
 * ValueStack 组件，用于创建灵活的垂直元素序列布局。
 * 
 * 此组件继承自 Stack，专门用于处理不同类型和大小的元素序列。每个元素可以是任意的
 * SDNode 组件，从上往下排列。与其他堆叠组件不同，ValueStack 不限制元素的尺寸，
 * 但会统一管理元素之间的间距，确保布局的整齐性。
 * 
 * 特性：
 * - 灵活元素：支持任意 SDNode 类型的元素。
 * - 自由尺寸：不限制元素的宽度和高度。
 * - 间距管理：自动处理元素之间的间隔。
 * - 水平对齐：支持多种水平对齐方式。
 * 
 * 常见应用场景：
 * - 垂直导航菜单的布局。
 * - 不同宽度卡片的堆叠。
 * - 自定义表单的垂直布局。
 * - 多样化内容的列表展示。
 */
export class ValueStack extends Stack {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取当前的水平对齐方式。
     * 
     * 使用场景：
     * - 在调整布局前获取当前对齐设置。
     * - 根据当前对齐方式计算元素位置。
     * - 在保存布局状态时记录对齐设置。
     * 
     * @returns 当前的对齐方式（"x"、"cx" 或 "mx"）。
     */
    align(): Align;

    /**
     * 设置元素的水平对齐方式。
     * 
     * 提供三种对齐选项：
     * - "x"：元素左侧对齐，适合统一起始位置的布局。
     * - "cx"：元素中心对齐，创建视觉上的平衡感。
     * - "mx"：元素右侧对齐，适合统一结束位置的布局。
     * 
     * 使用场景：
     * - 使用左侧对齐创建标准布局。
     * - 使用中心对齐突出重要信息。
     * - 使用右侧对齐展示辅助信息。
     * 
     * @param align 要设置的对齐方式。
     * @returns this 用于支持链式调用。
     */
    align(align: Align): this;
}
