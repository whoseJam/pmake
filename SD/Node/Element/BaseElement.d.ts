import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDRule } from "@/Rule/Rule";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

/**
 * Element 基础组件，为可视化元素提供统一的接口和基础功能。
 * 
 * 此组件是所有元素类型的基类，继承自 SDNode。每个 Element 由两个核心部分组成：
 * - background：背景层，负责元素的视觉效果（颜色、边框等）。
 * - value：值层（可选），通常居中显示在背景层之上。
 * 
 * 特性：
 * - 双层结构：分离视觉效果与实际内容。
 * - 统一接口：提供标准的样式和布局管理方法。
 * - 自动布局：value 默认在 background 中居中显示。
 * - 链式调用：所有 setter 方法支持链式操作。
 * 
 * 应用场景：
 * - 构建基础可视化组件（如按钮、卡片等）。
 * - 创建数据展示元素（如图表节点）。
 * - 设计交互式界面元素。
 * 
 * 此类不应被直接实例化。
 */
export class BaseElement extends SDNode {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取元素的空闲率。
     * @returns 当前的空闲率值。
     */
    rate(): number;

    /**
     * 设置元素的空闲率。
     * 
     * 空闲率计算方式：
     * rate = min(ew / vw, eh / vh)
     * - vw, vh: value 的宽度和高度。
     * - ew, eh: Element 的宽度和高度。
     * 
     * @param rate 目标利用率值。
     * @returns this 用于支持链式调用。
     */
    rate(rate: number): this;

    /**
     * 获取元素的颜色。
     * @returns 当前的颜色配置。
     */
    color(): PacketColor;

    /**
     * 设置元素的颜色。
     * 
     * 此方法直接操作 background 的颜色属性，是最基础的样式设置方法。
     * 
     * @param color 目标颜色值。
     * @returns this 用于支持链式调用。
     */
    color(color: SDColor): this;

    /**
     * 获取元素的填充颜色。
     * @returns 当前的填充颜色。
     */
    fill(): HexColor;

    /**
     * 设置元素的填充颜色。
     * 
     * 此方法设置 background 的填充颜色，常用于设置元素的主要颜色。
     * 
     * @param fill 十六进制颜色值。
     * @returns this 用于支持链式调用。
     */
    fill(fill: HexColor): this;

    /**
     * 获取元素填充的透明度。
     * @returns 当前的填充透明度值。
     */
    fillOpacity(): number;

    /**
     * 设置元素填充的透明度。
     * @param opacity 透明度值（0-1）。
     * @returns this 用于支持链式调用。
     */
    fillOpacity(opacity: number): this;

    /**
     * 获取元素的边框颜色。
     * @returns 当前的边框颜色。
     */
    stroke(): HexColor;

    /**
     * 设置元素的边框颜色。
     * @param stroke 边框的十六进制颜色值。
     * @returns this 用于支持链式调用。
     */
    stroke(stroke: HexColor): this;

    /**
     * 获取元素边框的透明度。
     * @returns 当前的边框透明度值。
     */
    strokeOpacity(): number;

    /**
     * 设置元素边框的透明度。
     * @param opacity 透明度值。
     * @returns this 用于支持链式调用。
     */
    strokeOpacity(opacity: number): this;

    /**
     * 获取元素的边框宽度。
     * @returns 当前的边框宽度值。
     */
    strokeWidth(): number;

    /**
     * 设置元素的边框宽度。
     * @param width 边框宽度。
     * @returns this 用于支持链式调用。
     */
    strokeWidth(width: number): this;

    /**
     * 获取元素的背景节点。
     * @returns background 节点实例。
     */
    background(): SDNode;

    /**
     * 获取元素的文本内容。
     * @returns 当前的文本内容。
     */
    text(): string;

    /**
     * 设置元素的文本内容。
     * 
     * 此方法是设置 value 内容的快捷方式，适用于纯文本场景。
     * 
     * @param text 要显示的文本内容。
     * @returns this 用于支持链式调用。
     */
    text(text: string): this;

    /**
     * 移除元素的值内容。
     * 
     * 此方法会清除当前元素对值的引用，但不会销毁值本身：
     * - 值节点会保持不动。
     * - 值节点在场景中仍然可见。
     * - 元素会回到仅有 background 的状态。
     * 
     * 使用场景：
     * - 移除元素的值内容，但不希望其消失。
     * 
     * @returns this 用于支持链式调用。
     */
    drop(): this;

    /**
     * 获取元素值的数值表示。
     * 
     * 此方法会尝试将元素的值转换为整数：
     * - 如果值本身是数字，直接返回。
     * - 如果值是文本，尝试解析为整数。
     * - 如果值是其他类型，返回 0。
     * 
     * 使用场景：
     * - 数组索引的计算。
     * - 元素的数值排序。
     * - 数值比较和运算。
     * 
     * @returns 转换后的整数值。转换失败时返回 0。
     */
    intValue(): number;

    /**
     * 获取元素的值节点。
     * 
     * 使用场景：
     * - 获取元素当前的值内容。
     * - 直接操作值节点的属性。
     * - 在动画场景中引用值节点。
     * 
     * @returns value 节点实例。如果没有值，则返回 undefined。
     */
    value(): SDNode | undefined;

    /**
     * 设置元素的值内容。
     * 
     * 此方法会创建一个新的值节点：
     * - 如果传入基本类型（数字、字符串等），会创建对应的文本节点。
     * - 如果传入 SDNode，会直接使用该节点。
     * - 如果传入其他类型，会将其转换为字符串。
     * 
     * 布局行为：
     * - 默认将值居中显示在元素内。
     * - 可通过 rule 参数自定义布局规则。
     * 
     * 使用场景：
     * - 设置元素的显示内容。
     * - 更新元素的数据。
     * - 自定义元素的内容布局。
     * 
     * @param value 要设置的值。可以是基本类型或 SDNode。
     * @param rule 值相对于元素的布局规则，可选。默认使用居中布局。
     * @returns this 用于支持链式调用。
     */
    value(value: any, rule?: SDRule): this;

    /**
     * 从场景中的已存在节点设置值。
     * 
     * 此方法与普通的 value 方法的区别：
     * - 不会创建新节点，而是复用已存在的节点。
     * - 节点会从当前位置移动到元素内。
     * - 在动画场景中，会显示节点的移动过程。
     * 
     * 布局行为：
     * - 默认将值居中显示在元素内。
     * - 可通过 rule 参数自定义布局规则。
     * 
     * 使用场景：
     * - 实现元素间的值传递。
     * 
     * @param value 场景中已存在的节点。必须是有效的 SDNode 实例。
     * @param rule 值相对于元素的布局规则，可选。默认使用居中布局。
     * @returns this 用于支持链式调用。
     */
    valueFromExist(value: SDNode, rule?: SDRule): this;
}
