import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDRule } from "@/Rule/Rule";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

/**
 * 元素基类
 * 
 * 元素由背景和价值物组成，通常价值物会被放置在背景的中间
 */
export class BaseElement extends SDNode {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取元素的空闲率
     */
    rate(): number;

    /**
     * 设置元素的空闲率
     * @param rate 空闲率
     */
    rate(rate: number): this;

    /**
     * 获取元素颜色，本质上是在获取背景的颜色
     */
    color(): PacketColor;
    
    /**
     * 设置元素颜色，本质上是在设置背景的颜色
     * @param color 
     */
    color(color: SDColor): this;

    /**
     * 获取元素的填充色，本质上是在获取背景的填充色
     */
    fill(): HexColor;

    /**
     * 设置元素的填充色，本质上是在设置背景的填充色
     * @param fill 填充色
     */
    fill(fill: HexColor): this;

    /**
     * 获取元素的填充透明度，本质上是在获取背景的填充透明度
     */
    fillOpacity(): number;

    /**
     * 设置元素的填充透明度，本质上是在设置背景的填充透明度
     * @param opacity 透明度
     */
    fillOpacity(opacity: number): this;

    /**
     * 获取元素的边框色，本质上是在获取背景的边框色
     */
    stroke(): HexColor;

    /**
     * 设置元素的边框色，本质上是在设置背景的边框色
     * @param stroke 
     */
    stroke(stroke: HexColor): this;

    /**
     * 获取元素的边框透明度，本质上是在获取背景的边框透明度
     */
    strokeOpacity(): number;

    /**
     * 设置元素的边框透明度，本质上是在设置背景的边框透明度
     * @param opacity 边框透明度
     */
    strokeOpacity(opacity: number): this;

    /**
     * 获取元素的边框宽度，本质上是在获取背景的边框宽度
     */
    strokeWidth(): number;

    /**
     * 设置元素的边框宽度，本质上是在设置背景的边框宽度
     * @param width 边框宽度
     */
    strokeWidth(width: number): this;

    /**
     * 获取背景
     */
    background(): SDNode;

    /**
     * 获取元素内价值物的文本
     */
    text(): string;

    /**
     * 设置元素内价值物的文本
     * @param text 文本
     */
    text(text: string): this;

    /**
     * 丢弃元素内的价值物
     */
    drop(): this;

    /**
     * 获取元素内价值物的数值
     */
    intValue(): number;

    /**
     * 获取元素内的价值物
     */
    value(): SDNode;

    /**
     * 设置元素内的价值物
     * @param value 价值物
     */
    value(value: any): this;

    /**
     * 设置容器内的价值物
     * @param value 价值物
     * @param rule 价值物相对于元素的规则
     */
    value(value: any, rule: SDRule): this;
    
    /**
     * 设置容器内的价值物，并且这个价值物是已存在的
     * @param value 价值物
     */
    valueFromExist(value: SDNode);
    
    /**
     * 设置容器内的价值物，并且这个价值物是已存在的
     * @param value 价值物
     * @param rule 价值物相对于元素的规则
     */
    valueFromExist(value: SDNode, rule: SDRule): this;
}
