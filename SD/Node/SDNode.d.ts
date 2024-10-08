import { D3Layer } from "SD/Node/SDNode/D3Layer";

import { Vector } from "@/Math/Math";

import { RenderNode } from "@/Renderer/RenderNode";

type Rule = (parent: SDNode, child: SDNode) => void;
type EnterCallback = (element: SDNode, move: () => void) => void;

export class SDNode {
    constructor(parent: SDNode);
    newLayer(name: string): this;
    layer(name: string): RenderNode;
    attachTo(layer: SDNode|RenderNode): void
    
    childAs(name: string, child: SDNode, rule: Rule): this
    childAs(name: string, child: SDNode): this
    childAs(child: SDNode, rule: Rule): this;
    childAs(child: SDNode): this

    child(name: string): SDNode;

    /**
     * 开启一段动画
     * @param duration 动画持续时长
     */
    startAnimate(duration: number): this;

    /**
     * 根据另一个节点，开启一段动画
     * @param other 参考节点
     */
    startAnimate(other: SDNode): this;
    
    /**
     * 开启一段在[start,end]时间区间上的动画
     * @param start 动画开始时间
     * @param end 动画结束时间
     */
    startAnimate(start: number, end: number): this;
    
    /**
     * 开启一段动画，默认时长300ms
     */
    startAnimate(): this;
    
    /**
     * 结束一段动画
     */
    endAnimate(): this;

    /**
     * 判断是否处于动画状态中
     */
    isAnimating(): boolean;

    /**
     * 获取当前动画延迟时间
     */
    delay(): number;

    /**
     * 获取当前动画持续时长
     */
    duration(): number;

    /**
     * 设置延迟时间
     * @param delay 延迟时间
     */
    after(delay: number): this;

    /**
     * 根据另一个节点，设置延迟时间
     * @param other 参考节点
     */
    after(other: SDNode): this;

    /**
     * 获取透明度
     */
    opacity(): number;

    /**
     * 设置透明度
     * @param opacity 
     */
    opacity(opacity: number): this;

    /**
     * 判断某个坐标是否落在节点内部
     * @param point
     */
    inRange(point: Vector): boolean;

    /**
     * 移除该元素（以及子元素）
     */
    remove(): void

    /**
     * 获取 x 坐标
     */
    x(): number;

    /**
     * 设置 x 坐标
     * @param x 
     */
    x(x: number): this;

    /**
     * 获取 y 坐标
     */
    y(): number;

    /**
     * 设置 y 坐标
     * @param y 
     */
    y(y: number): this;

    /**
     * 缩放节点
     * @param scale 缩放倍数 
     */
    scale(scale: number): this;

    /**
     * 获取宽度
     */
    width(): number;

    /**
     * 设置宽度
     * @param width 
     */
    width(width: number): this;

    /**
     * 获取高度
     */
    height(): number;

    /**
     * 设置高度
     * @param height 
     */
    height(height: number): this;
    
    pos(xLocator: string, yLocator: string, dx: number, dy: number): Vector;
    
    /**
     * 获取中点
     */
    center(): Vector;

    /**
     * 设置中点
     * @param center 
     */
    center(center: Vector): this;

    /**
     * 设置中点
     * @param cx 
     * @param cy 
     */
    center(cx: number, cy: number): this;

    /**
     * 获取 x 方向的 k 分位点
     * @param k 
     */
    kx(k: number): number;

    /**
     * 获取 y 方向的 k 分位点
     * @param k 
     */
    ky(k: number): number;

    /**
     * 获取中点的 x 坐标
     */
    cx(): number;

    /**
     * 设置中点的 x 坐标
     * @param cx 
     */
    cx(cx: number): this;

    /**
     * 获取中点的 y 坐标
     */
    cy(): number;

    /**
     * 设置中点的 y 坐标
     * @param cy 
     */
    cy(cy: number): this;

    /**
     * 在 x 方向上移动一段距离
     * @param dx 
     */
    dx(dx: number): this;

    /**
     * 在 y 方向上移动一段距离
     * @param dy 
     */
    dy(dy: number): this;

    /**
     * 获取 x 坐标最大值
     */
    mx(): number;

    /**
     * 设置 x 坐标最大值
     * @param mx 
     */
    mx(mx: number): this;

    /**
     * 获取 y 坐标最大值
     */
    my(): number;

    /**
     * 设置 y 坐标最大值
     * @param my 
     */
    my(my: number): this;

    preUpdate(): void;
    update(): this;
    postUpdate(): void;
    freeze(): void;
    unfreeze(): void;
    freezing(): boolean;

    drag(type: true): this;

    /**
     * 设置单击回调函数
     * @param callback 
     */
    onClick(callback: (obj: this) => void): this;

    /**
     * 设置双击回调函数
     * @param callback 
     */
    onDblClick(callback: (obj: this) => void): this;

    rule(): Rule;
    rule(rule: Rule): this;
    triggerRule(): this;
    onEnter(enter: EnterCallback): this;
}