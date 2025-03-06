import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Input 组件。
 * 
 * 此组件继承自 BaseHTML，提供文本输入功能：
 * - 值管理：支持获取和监听输入值。
 * - 标签：支持设置输入框标签。
 * - 事件：支持输入值变化的回调。
 * 
 * 使用场景：
 * - 用户数据输入。
 * - 表单信息收集。
 * - 搜索框实现。
 */
export class Input extends BaseHTML {
    /**
     * 创建一个新的输入框实例。
     * @param parent 父节点，用于确定输入框在 DOM 树中的位置。
     */
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取输入框的当前值。
     * @returns 当前输入的文本内容。
     */
    value(): string;

    /**
     * 获取输入框的标签文本。
     * @returns 当前的标签文本。
     */
    label(): string;

    /**
     * 设置输入框的标签文本。
     * @param label 要显示的标签文本。
     * @returns this 用于支持链式调用。
     */
    label(label: string): this;

    /**
     * 设置输入值变化的事件处理函数。
     * 
     * 使用场景：
     * - 实时数据验证。
     * - 动态内容更新。
     * - 自动保存功能。
     * 
     * @param callback 值变化时的回调函数，参数为新的输入值。
     * @returns this 用于支持链式调用。
     */
    onChange(callback: (value: string) => void): this;
}
