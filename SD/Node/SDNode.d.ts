import { RenderNode } from "@/Renderer/RenderNode";

type EnterCallback = (element: SDNode, move: () => void) => void;

export class SDNode {
    constructor(parent: SDNode);
    constructor(parent: SDNode, layer: RenderNode);

    type(type: string): this;

    layer(): RenderNode;
    layer(name: string): RenderNode;

    newLayer(name: string): this;
    layer(name: string): RenderNode;
    attachTo(layer: SDNode): this;
    attachTo(layer: RenderNode): this;
    
    childAs(name: string, child: SDNode, rule: Rule): this
    childAs(name: string, child: SDNode): this
    childAs(child: SDNode, rule: Rule): this;
    childAs(child: SDNode): this

    child(name: string): SDNode;

    eraseChild(name: string): SDNode;
    eraseChild(child: SDNode): SDNode;

    startAnimate(duration: number): this;
    startAnimate(other: SDNode): this;
    startAnimate(start: number, end: number): this;
    startAnimate(): this;
    endAnimate(): this;
    isAnimating(): boolean;
    delay(): number;
    after(delay: number): this;
    after(other: SDNode): this;
    duration(): number;

    opacity(): number;
    opacity(opacity: number): this;
    inRange(point: [number, number]): boolean;
    remove(): void

    x(): number;
    x(x: number): this;
    y(): number;
    y(y: number): this;
    width(): number;
    width(width: number): this;
    height(): number;
    height(height: number): this;
    scale(scale: number): this;
    pos(xLocator: string, yLocator: string, dx: number, dy: number): [number, number];
    center(): [number, number];
    center(center: [number, number]): this;
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

    update(): this;
    preUpdate(): void;
    postUpdate(): void;
    tryUpdate(): void;
    pendUpdate(): void;
    attachUpdate(update: () => void): void;
    removeUpdate(update: () => void): void;
    tryMove(element: SDNode, move: () => void): void;
    freeze(): void;
    unfreeze(): void;
    freezing(): boolean;

    drag(type: true): this;
    drag(type: false|null|undefined)
    drag(onDrag: (dx: number, dy: number) => [number, number]): this;
    clickable(type: true): this;
    clickable(type: false|null|undefined);
    onClick(onClick: (node: this) => void): this;
    onDblClick(onClick: (node: this) => void): this;

    rule(): (parent: SDNode, child: SDNode) => void;
    rule(rule: (parent: SDNode, child: SDNode) => void): this;
    triggerRule(): this;
    onEnter(enter: (element: SDNode, move: () => void) => void): this;
    triggerEnter(): this;
    onExit(exit: (element: SDNode) => void): this;
    triggerExit(): this;

    title(title: string): this;
}