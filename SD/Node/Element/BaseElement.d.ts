import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDRule } from "@/Rule/Rule";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

/**
 * Element 基类
 *
 * Element 由 background 和 value(optional) 组成，通常 value 会被放置在背景的中间
 *
 * 此类不应该被实例化，它为所有类似于 Element 的组件提供公共方法
 */
export class BaseElement extends SDNode {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取 Element 的空闲率
     */
    rate(): number;

    /**
     * 设置 Element 的空闲率
     *
     * 假设 value 的宽度为 vw，高度为 vh，Element 的宽度为 ew，高度为 eh，则 rate = min(ew / vw, eh / vh)
     * @param rate 空闲率
     */
    rate(rate: number): this;

    /**
     * 获取 Element 的颜色，本质上是在获取 background 的颜色
     */
    color(): PacketColor;

    /**
     * 设置 Element 的颜色，本质上是在设置 background 的颜色
     * @param color
     */
    color(color: SDColor): this;

    /**
     * 获取 Element 的填充色，本质上是在获取 background 的填充色
     */
    fill(): HexColor;

    /**
     * 设置 Element 的填充色，本质上是在设置 background 的填充色
     * @param fill 填充色
     */
    fill(fill: HexColor): this;

    /**
     * 获取 Element 的填充透明度，本质上是在获取 background 的填充透明度
     */
    fillOpacity(): number;

    /**
     * 设置 Element 的填充透明度，本质上是在设置 background 的填充透明度
     * @param opacity 透明度
     */
    fillOpacity(opacity: number): this;

    /**
     * 获取 Element 的边框色，本质上是在获取 background 的边框色
     */
    stroke(): HexColor;

    /**
     * 设置 Element 的边框色，本质上是在设置 background 的边框色
     * @param stroke
     */
    stroke(stroke: HexColor): this;

    /**
     * 获取 Element 的边框透明度，本质上是在获取 background 的边框透明度
     */
    strokeOpacity(): number;

    /**
     * 设置 Element 的边框透明度，本质上是在设置 background 的边框透明度
     * @param opacity 边框透明度
     */
    strokeOpacity(opacity: number): this;

    /**
     * 获取 Element 的边框宽度，本质上是在获取 background 的边框宽度
     */
    strokeWidth(): number;

    /**
     * 设置 Element 的边框宽度，本质上是在设置 background 的边框宽度
     * @param width 边框宽度
     */
    strokeWidth(width: number): this;

    /**
     * 获取 background
     */
    background(): SDNode;

    /**
     * 获取 value 的文本
     */
    text(): string;

    /**
     * 设置 value 的文本
     * @param text 文本
     */
    text(text: string): this;

    /**
     * 丢弃 value
     */
    drop(): this;

    /**
     * 获取 value 的数值
     */
    intValue(): number;

    /**
     * 获取 value
     */
    value(): SDNode;

    /**
     * 设置 value
     * @param value 价值物
     */
    value(value: any): this;

    /**
     * 设置 value
     * @param value
     * @param rule value 相对于 Element 的规则
     */
    value(value: any, rule: SDRule): this;

    /**
     * 设置 value，并且 value 是已存在于场景中的，在动画表示下 value 会移动到 Element 内
     * @param value
     */
    valueFromExist(value: SDNode);

    /**
     * 设置 value，并且 value 是已存在于场景中的，在动画表示下 value 会移动到 Element 内
     * @param value
     * @param rule value 相对于 Element 的规则
     */
    valueFromExist(value: SDNode, rule: SDRule): this;
}
