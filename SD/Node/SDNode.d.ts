import { D3Layer } from "SD/Node/D3Layer";

import { Vector } from "SD/Utility/Math";

type Rule = (parent: SDNode, child: SDNode) => void;

export class SDNode {
    constructor(parent: SDNode|D3Layer);
    g(): any;
    newLayer(name: number|string): any
    layer(name: number|string): any
    attachTo(layer: any): void
    
    childAs(name: number|string, child: SDNode, rule: Rule): this
    childAs(name: number|string, child: SDNode): this
    childAs(child: SDNode, rule: Rule): this;
    childAs(child: SDNode): this

    child(name: number|string): SDNode;

    /**
     * 开启一段时长为duration的动画
     * @param duration 动画持续时长
     */
    startAnimate(duration: number): this
    /**
     * 以other为参考开启一段动画
     * @param other 
     */
    startAnimate(other: SDNode): this
    /**
     * 开启一段在[start,end]时间区间上的动画
     * @param start 动画开始时间
     * @param end 动画结束时间
     */
    startAnimate(start: number, end: number): this
    /**
     * 开启一段动画，默认时长300ms
     */
    startAnimate(): this
    endAnimate(): this;
    isAnimating(): boolean;
    delay(): number;
    duration(): number;
    after(delay: number): this;
    after(other: SDNode): this;

    opacity(): number;
    opacity(opacity: number): this;

    inRange(vector: Vector): boolean;

    remove(): void

    x(): number;
    x(x: number): this;
    y(): number;
    y(y: number): this;
    scale(scale: number): this;
    width(): number;
    width(width: number): this;
    height(): number;
    height(height: number): this;
    pos(xLocator: string, yLocator: string, dx: number, dy: number): Vector;
    center(): Vector;
    center(center: Vector): this;
    center(cx: number, cy: number): this;
    kx(k: number): number;
    ky(k: number): number;
    cx(): number;
    cx(cx: number): this;
    cy(): number;
    cy(cy: number): this;
    dx(dx: number): this;
    dy(dy: number): this;
    mx(): number;
    mx(mx: number): this;
    my(): number;
    my(my: number): this;

    preUpdate(): void;
    update(): this;
    postUpdate(): void;
    freeze(): void;
    unfreeze(): void;
    freezing(): boolean;
}