import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * TextArea 组件。
 * 
 * 此组件继承自 BaseHTML，提供多行文本输入功能：
 * - 文本管理：支持获取和设置多行文本。
 * - 自动换行：支持文本的自动换行。
 * - 事件：支持文本变化的回调。
 * 
 * 使用场景：
 * - 长文本输入。
 * - 代码编辑。
 * - 评论框实现。
 * 
 * @extends {BaseHTML}
 */
export class TextArea extends BaseHTML {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取文本域的当前内容。
     * @returns 当前输入的文本内容，包含换行符。
     */
    value(): string;

    /**
     * 设置文本域的内容。
     * 
     * 使用场景：
     * - 预填充文本内容。
     * - 重置文本内容。
     * - 加载已保存的数据。
     * 
     * @param value 要设置的文本内容。
     * @returns this 用于支持链式调用。
     */
    value(value: string): this;

    /**
     * 设置文本内容变化的事件处理函数。
     * 
     * 使用场景：
     * - 实时文本验证。
     * - 自动保存功能。
     * - 字数统计显示。
     * 
     * @param callback 内容变化时的回调函数，参数为新的文本内容。
     * @returns this 用于支持链式调用。
     */
    onChange(callback: (value: string) => void): this;
}
