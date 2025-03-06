import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * Slider 组件。
 * 
 * 此组件继承自 BaseHTML，提供滑块控制功能：
 * - 范围控制：支持设置最大最小值。
 * - 值管理：支持获取和设置当前值。
 * - 事件：支持值变化的回调。
 * 
 * 使用场景：
 * - 数值范围选择。
 * - 进度条控制。
 * - 音量等级调节。
 */
export class Slider extends BaseHTML {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取滑块的最大值。
     * @returns 当前设置的最大值。
     */
    max(): number;

    /**
     * 设置滑块的最大值。
     * 
     * 使用场景：
     * - 限制数值上限。
     * - 调整可选范围。
     * 
     * @param max 最大值。
     * @returns this 用于支持链式调用。
     */
    max(max: number): this;

    /**
     * 获取滑块的最小值。
     * @returns 当前设置的最小值。
     */
    min(): number;

    /**
     * 设置滑块的最小值。
     * 
     * 使用场景：
     * - 限制数值下限。
     * - 调整可选范围。
     * 
     * @param min 最小值。
     * @returns this 用于支持链式调用。
     */
    min(min: number): this;

    /**
     * 获取滑块的当前值。
     * @returns 当前值，在最小值和最大值之间。
     */
    value(): number;

    /**
     * 设置滑块的当前值。
     * 
     * 使用场景：
     * - 初始化滑块位置。
     * - 程序控制滑块。
     * - 重置滑块状态。
     * 
     * @param value 要设置的值，会被限制在最小值和最大值之间。
     * @returns this 用于支持链式调用。
     */
    value(value: number): this;

    /**
     * 设置滑块值变化的事件处理函数。
     * 
     * 使用场景：
     * - 实时数值更新。
     * - 联动控制其他组件。
     * - 数据同步处理。
     * 
     * @param callback 值变化时的回调函数，参数为新的数值。
     * @returns this 用于支持链式调用。
     */
    onChange(callback: (value: number) => void): this;
}
