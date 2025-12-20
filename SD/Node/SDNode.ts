import { Action } from "@/Animate/Action";
import { Context } from "@/Animate/Context";
import { Interp, InterpCreator, InterpFunction, InterpObject, LazyInterpFunction } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";
import { SDTimingFunction, TimingFunction as T } from "@/Math/TimingFunction";
import { RenderNode } from "@/Renderer/RenderNode";

type PercentString = `${number}%`;
type XLocationString = "left" | "center" | "right";
type YLocationString = "top" | "middle" | "bottom";
type XLocation = number | PercentString | XLocationString;
type YLocation = number | PercentString | YLocationString;

export type SDBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

function isBuiltinInterp(
    method: InterpObject | InterpFunction | LazyInterpFunction | InterpCreator
): method is InterpCreator {
    if (typeof method !== "function") return false;
    const statics = Object.getOwnPropertyNames(Interp);
    for (const propName of statics) {
        const propValue = Interp[propName];
        if (propValue === method) return true;
    }
    return false;
}

export abstract class SDNode {
    id: number;
    _: {
        frame: number;
        start: number;
        end: number;
        subAnimates: Array<Context>;
        timingFunction: SDTimingFunction;
        layer: RenderNode;
        opacity: number;
        scale: [number, number];
        rotate: number;
        translate: [number, number];
        transformOrigin: [number, number];
        attributeListeners: { [key: string]: Array<(vn: any, vo: any) => void> };
        [key: string]: any;
    };
    static NODE_ID = 0;
    constructor() {
        this.id = ++SDNode.NODE_ID;
        this._ = {
            renderer: undefined,
            frame: -1,
            start: 0,
            end: 0,
            subAnimates: [],
            timingFunction: undefined,
            layer: undefined,
            ready: false,
            opacity: 1,
            scale: [1, 1],
            rotate: 0,
            translate: [0, 0],
            transformOrigin: [0, 0],
            attributeListeners: {},
        };

        this._.layer = RenderNode.createRenderNode(this, undefined, "g");
    }

    /**
     * Gets the type label of this component.
     * Returns undefined if the type was not defined during component initialization.
     * @returns {string | undefined} The type label if defined; otherwise, undefined.
     */
    getType(): string {
        return this._.layer.getAttribute("type");
    }

    /**
     * Sets the type label for this component.
     * This method should be called during component initialization.
     * @param type - The type label to assign to the component.
     * @returns The current component instance for method chaining.
     */
    setType(type: string): this {
        this._.layer.setAttribute("type", type);
        return this;
    }

    /**
     * Gets the default render layer for this component.
     * The layer determines the display order and may affect visual stacking (z-index).
     * @returns The render layer associated with this component.
     */
    getLayer(): RenderNode {
        return this._.layer;
    }

    /**
     * Creates a new named render layer on this component.
     * Newly created layers are stacked above existing ones.
     * @param name - The unique identifier for the new layer.
     * @returns The current component instance for method chaining.
     */
    newLayer(name: string) {
        const layer = RenderNode.createRenderNodeWithoutAction(this, this._.layer, "g");
        this._.layers[name] = layer;
        layer.setAttribute("layer", name);
        return this;
    }

    append(child: SDNode | RenderNode) {
        if (child instanceof SDNode) this.getLayer().append(child.getLayer());
        else this.getLayer().append(child);
        return this;
    }

    appendChild(child: SDNode | RenderNode) {
        if (child instanceof SDNode) this.getLayer().appendChild(child.getLayer());
        else this.getLayer().appendChild(child);
        return this;
    }

    insertBefore(child: SDNode | RenderNode, referenced: SDNode | RenderNode) {
        const child_ = child instanceof SDNode ? child.getLayer() : child;
        const referenced_ = referenced instanceof SDNode ? referenced.getLayer() : referenced;
        this.getLayer().insertBefore(child_, referenced_);
        return this;
    }

    startSubAnimate() {
        const context = new Context(this);
        this._.subAnimates.push(context);
        return this;
    }

    subAnimate(l: number, r: number) {
        const context = this._.subAnimates[this._.subAnimates.length - 1];
        context.till(l, r);
        return this;
    }
    endSubAnimate() {
        const context = this._.subAnimates.pop();
        context.recover();
        return this;
    }

    startAnimate(args?: { delay?: number; duration?: number; easing?: SDTimingFunction }) {
        this._.start = args?.delay ?? 0;
        this._.end = args?.duration ?? 300;
        this._.timingFunction = args?.easing ?? T.easeInOut;
        return this;
    }

    /**
     * Finalizes and applies the current animation sequence.
     * - Call this method after configuring properties with `startAnimate()` to finish the animation.
     * @returns The current component instance for method chaining.
     */
    endAnimate(): this {
        this._.start = 0;
        this._.end = 0;
        this._.timingFunction = undefined;
        return this;
    }

    /**
     * Gets the delay of current animation sequence.
     * This method returns the time offset from the animation's start time.
     * @returns The delay duration in milliseconds.
     */
    delay() {
        return this._.start;
    }

    /**
     * Gets the duration of current animation sequence.
     */
    duration() {
        return this._.end - this._.start;
    }

    /**
     * Removes this component from the scene.
     * @returns The current component instance for method chaining.
     */
    remove() {
        this._.layer.remove();
    }

    getOpacity(): number {
        return this._.opacity;
    }

    setOpacity(opacity: number): this {
        return this.triggerAttributeChanged(this._.layer, "opacity", opacity, this._.opacity);
    }

    onOpacityChanged(listener: (vn: number, vo: number) => void): this {
        return this.onAttributeChanged("opacity", listener);
    }

    offOpacityChanged(listener: (vn: number, vo: number) => void): this {
        return this.offAttributeChanged("opacity", listener);
    }

    abstract getX(): number;
    abstract getY(): number;
    abstract getWidth(): number;
    abstract getHeight(): number;

    setScale(scale: number): this;
    setScale(sx: number, sy: number): this;
    setScale(s: [number, number]): this;
    setScale(sx: number | [number, number], sy?: number): this {
        if (Array.isArray(sx)) return this.setScale(sx[0], sx[1]);
        if (sy === undefined) return this.setScale(sx, sx);
        return this.triggerAttributeChanged(this._.layer, "scale", [sx, sy], this._.scale);
    }

    getScale(): [number, number] {
        return this._.scale;
    }

    onScaleChanged(listener: (vn: [number, number], vo: [number, number]) => void): this {
        return this.onAttributeChanged("scale", listener);
    }

    offScaleChanged(listener: (vn: [number, number], vo: [number, number]) => void): this {
        return this.offAttributeChanged("scale", listener);
    }

    setRotation(rotate: number): this {
        return this.triggerAttributeChanged(this._.layer, "rotate", rotate, this._.rotate);
    }

    onRotateChanged(listener: (vn: number, vo: number) => void): this {
        return this.onAttributeChanged("rotate", listener);
    }

    offRotateChanged(listener: (vn: number, vo: number) => void): this {
        return this.offAttributeChanged("rotate", listener);
    }

    setTranslate(dx: number, dy: number): this;
    setTranslate(d: [number, number]): this;
    setTranslate(dx: number | [number, number], dy?: number): this {
        if (Array.isArray(dx)) return this.setTranslate(dx[0], dx[1]);
        return this.triggerAttributeChanged(this._.layer, "translate", [dx, dy], this._.translate);
    }

    onTranslateChanged(listener: (vn: [number, number], vo: [number, number]) => void) {
        return this.onAttributeChanged("translate", listener);
    }

    offTranslateChanged(listener: (vn: [number, number], vo: [number, number]) => void) {
        return this.offAttributeChanged("translate", listener);
    }

    setTransformOrigin(x: XLocation, y: YLocation): this;
    setTransformOrigin(origin: [XLocation, YLocation]): this;
    setTransformOrigin(x: XLocation | [XLocation, YLocation], y?: YLocation) {
        if (Array.isArray(x)) return this.setTransformOrigin(x[0], x[1]);
        const parse = (value: number | string, position: string, size: string) => {
            if (typeof value === "number") return value;
            if (value === "center") return parse("50%", position, size);
            if (value === "top") return parse("0%", position, size);
            if (value === "bottom") return parse("100%", position, size);
            if (value === "left") return parse("0%", position, size);
            if (value === "right") return parse("100%", position, size);
            if (value.endsWith("%")) return this[position]() + (parseFloat(value) / 100) * this[size]();
            return +value;
        };
        const x_ = parse(x, "x", "width");
        const y_ = parse(y, "y", "height");
        const vo = this._.transformOrigin;
        this._.transformOrigin = [x_, y_];
        return this.triggerAttributeChanged(this._.layer, "transformOrigin", [x_, y_], vo);
    }

    getTransformOrigin(): [number, number] {
        return this._.transformOrigin;
    }

    onTransformOriginChanged(listener: (vn: [number, number], vo: [number, number]) => void) {
        return this.onAttributeChanged("transformOrigin", listener);
    }

    offTransformOriginChanged(listener: (vn: [number, number], vo: [number, number]) => void) {
        return this.offAttributeChanged("transformOrigin", listener);
    }

    getCenter(): [number, number] {
        return [this.getCenterX(), this.getCenterY()];
    }

    getCenterX(): number {
        return this.getX() + this.getWidth() / 2;
    }

    getCx(): number {
        return this.getCenterX();
    }

    getCenterY(): number {
        return this.getY() + this.getHeight() / 2;
    }

    getCy(): number {
        return this.getCenterY();
    }

    getMaxX() {
        return this.getX() + this.getWidth();
    }

    getMaxY() {
        return this.getY() + this.getHeight();
    }

    /**
     * Makes this component appear.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a component appear.
     * node.startAnimate().appear().endAnimate();
     */
    appear() {
        return this.startSubAnimate() // opacity from 0 to 1
            .subAnimate(0, 0)
            .setOpacity(0)
            .subAnimate(0, 1)
            .setOpacity(1)
            .endSubAnimate();
    }

    /**
     * Makes this component disappear.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a component disappear.
     * node.startAnimate().disappear().endAnimate();
     */
    disappear() {
        return this.startSubAnimate() // opacity from 1 to 0
            .subAnimate(0, 0)
            .setOpacity(1)
            .subAnimate(0, 1)
            .setOpacity(0)
            .endSubAnimate();
    }

    /**
     * Makes this component zoom in from scale 0 to 1.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a component zoom in.
     * node.startAnimate().zoomIn().endAnimate();
     */
    zoomIn() {
        return this.startSubAnimate() // scale from 0 to 1
            .subAnimate(0, 0)
            .setTransformOrigin(this.getCenter())
            .setScale(0)
            .subAnimate(0, 1)
            .setScale(1)
            .endSubAnimate();
    }

    /**
     * Makes this component zoom out from scale 1 to 0.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a component zoom out.
     * node.startAnimate().zoomOut().endAnimate();
     */
    zoomOut() {
        return this.startSubAnimate() // scale from 1 to 0
            .subAnimate(0, 0)
            .setTransformOrigin(this.getCenter())
            .setScale(1)
            .subAnimate(0, 1)
            .setScale(0)
            .endSubAnimate();
    }

    /**
     * Makes this component fade in by gradually increasing opacity from 0 to 1.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a component fade in.
     * node.startAnimate().fadeIn().endAnimate();
     */
    fadeIn() {
        return this.appear();
    }

    /**
     * Makes this component fade out by gradually decreasing opacity from 1 to 0.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a component fade out.
     * node.startAnimate().fadeOut().endAnimate();
     */
    fadeOut() {
        return this.disappear();
    }

    protected onAttributeChanged(key: string, listener: (vn: any, vo: any) => void) {
        if (!this._.attributeListeners[key]) this._.attributeListeners[key] = [];
        this._.attributeListeners[key].push(listener);
        return this;
    }

    protected offAttributeChanged(key: string, listener: (vn: any, vo: any) => void) {
        const index = this._.attributeListeners[key].indexOf(listener);
        if (index !== -1) this._.attributeListeners[key].splice(index, 1);
        return this;
    }

    protected triggerAttributeChanged(
        object: RenderNode,
        key: string,
        vn: any,
        vo: any,
        interp?: InterpObject | InterpFunction | LazyInterpFunction | InterpCreator
    ) {
        this._[key] = vn;
        object.setAttribute(key, vn);
        if (this.duration() > 0 && interp) {
            const interp_ = isBuiltinInterp(interp) ? interp(object, key) : interp;
            new Action(this._.start, this._.end, vo, vn, interp_, this._.timingFunction, this, key);
        }
        this._.attributeListeners[key]?.forEach(listener => listener(vn, vo));
        return this;
    }

    static __asNode(target: SDNode | RenderNode, object: any, id?: string): SDNode {
        if (object === null || object === undefined) {
            const { Text } = require("@/Node/Text/Text");
            if (id !== undefined) return new Text(target, id).opacity(0);
            return null;
        }
        if (typeof object === "function") return object(target).opacity(0);
        if (typeof object === "number" || typeof object === "string") {
            const { Text } = require("@/Node/Text/Text");
            const { Math } = require("@/Node/Text/Math");
            if (String(object).startsWith("$")) return new Math(target, id).opacity(0);
            return new Text(target, object).opacity(0);
        }
        return object;
    }
}

type AnyFunction = (...args: any[]) => any;
export type SDNodeWithColor = SDNode & { color: AnyFunction };
export type SDNodeWithDrop = SDNode & { drop: AnyFunction };
export type SDNodeWithIntValue = SDNode & { intValue: AnyFunction };
export type SDNodeWithText = SDNode & { text: AnyFunction };
export type SDNodeWithValue = SDNode & { value: AnyFunction };
export type SDNodeWithValueFromExist = SDNode & { valueFromExist: AnyFunction };
export type SDNodeWithRadius = SDNode & { r: AnyFunction };
