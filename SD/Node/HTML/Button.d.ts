import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { RenderNode } from "@/Renderer/RenderNode";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

/**
 * Button 组件。
 * 
 * 此组件继承自 BaseHTML，提供可交互的按钮功能：
 * - 文本：支持设置按钮文字。
 * - 事件：支持点击事件回调。
 * - 样式：支持颜色和边框的自定义。
 * 
 * 使用场景：
 * - 用户交互界面。
 * - 表单提交按钮。
 * - 功能触发控件。
 * 
 * @extends {BaseHTML}
 */
export class Button extends BaseHTML {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取按钮的文本内容。
     * @returns 当前按钮显示的文本。
     */
    text(): string;

    /**
     * 设置按钮的文本内容。
     * @param text 要显示的文本。
     * @returns this 用于支持链式调用。
     */
    text(text: string): this;

    /**
     * 设置按钮的点击事件处理函数。
     * 
     * 使用场景：
     * - 处理用户点击事件。
     * - 触发特定的业务逻辑。
     * - 实现界面交互。
     * 
     * @param callback 点击事件的回调函数。
     * @returns this 用于支持链式调用。
     */
    onClick(callback: () => void): this;

    /**
     * 获取按钮的填充颜色。
     * @returns 当前的填充颜色（十六进制格式）。
     */
    fill(): HexColor;

    /**
     * 设置按钮的填充颜色。
     * @param fill 填充颜色（十六进制格式）。
     * @returns this 用于支持链式调用。
     */
    fill(fill: HexColor): this;

    /**
     * 获取按钮的边框颜色。
     * @returns 当前的边框颜色（十六进制格式）。
     */
    stroke(): HexColor;

    /**
     * 设置按钮的边框颜色。
     * @param stroke 边框颜色（十六进制格式）。
     * @returns this 用于支持链式调用。
     */
    stroke(stroke: HexColor): this;

    /**
     * 获取按钮的颜色配置。
     * @returns 当前的颜色配置。
     */
    color(): PacketColor;

    /**
     * 设置按钮的颜色配置。
     * @param color 颜色配置。
     * @returns this 用于支持链式调用。
     */
    color(color: SDColor): this;
}
