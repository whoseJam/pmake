import { Action } from "@/Animate/Action";
import { Context } from "@/Animate/Context";
import { Interp, InterpCreator } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";
import { SDTimingFunction, TimingFunction as T } from "@/Math/TimingFunction";
import { reactive } from "@/Node/Core/Reactive";
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

export abstract class SDNode {
    id: number;
    vars: any;
    _: {
        frame: number;
        start: number;
        end: number;
        subAnimates: Array<Context>;
        timingFunction: SDTimingFunction;
        layer: RenderNode;
        [key: string]: any;
    };
    static NODE_ID = 0;
    constructor() {
        this.id = ++SDNode.NODE_ID;
        this._ = {
            frame: -1,
            start: 0,
            end: 0,
            subAnimates: [],
            timingFunction: undefined,
            layer: undefined,
            ready: false, // only when ready = true, the action can impact the node
        };

        this._.layer = RenderNode.createRenderNode(this, undefined, "g");

        this.vars = reactive({
            opacity: 1,
            scale: [1, 1],
            rotate: 0,
            translate: [0, 0],
            transformOrigin: [0, 0],
        });

        this.vars.watch("opacity", SDNode.__action(this, this._.layer, "opacity", Interp.numberInterp));
        this.vars.watch("scale", SDNode.__action(this, this._.layer, "scale", Interp.vectorInterp));
        this.vars.watch("rotate", SDNode.__action(this, this._.layer, "rotate", Interp.numberInterp));
        this.vars.watch("translate", SDNode.__action(this, this._.layer, "translate", Interp.vectorInterp));
        this.vars.watch(
            "transformOrigin",
            SDNode.__action(this, this._.layer, "transform-origin", Interp.vectorInterp)
        );
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
    appendChild(child: SDNode | RenderNode) {
        if (child instanceof SDNode) child.getLayer().moveTo(this.getLayer());
        else child.moveTo(this.getLayer());
        return this;
    }
    /**
     * Starts an animation sequence with optional custom duration.
     * During this sequence, all property changes are automatically animated instead of applied immediately.
     * Any child in the component tree will also be animated.
     *
     * - Call `endAnimate()` to finalize the animation sequence.
     * - All property changes between `startAnimate()` and `endAnimate()` are animated.
     * @param duration - Animation duration in milliseconds (default: 300ms).
     * @returns The current component instance for method chaining.*
     * @example
     * // Move a rectangle to (100, 100) and resize it to (50, 80)
     * rect.startAnimate().x(100).y(100).width(50).height(80).endAnimate();
     * @example
     * // Create a slow color transition for a circle
     * circle.startAnimate(5000).color(C.red).endAnimate();
     * @example
     * parent.startAnimate();
     * parent.color(C.blue);
     * child.color(C.yellow); // The child component will also be animated.
     * parent.endAnimate();
     */
    startAnimate(duration?: number): this;
    startAnimate(duration: number, timingFunction: SDTimingFunction): this;
    startAnimate(timingFunction: SDTimingFunction): this;
    /**
     * Starts an animation sequence by copying parameters from another component.
     * @param other - The source component whose animation parameters will be copied.
     * @returns The current component instance for method chaining.
     */
    startAnimate(other: SDNode): this;
    /**
     * Starts an animation sequence with a custom time range.
     * Animations will be evaluated over the specified duration in milliseconds.
     * @param start - The start time of the animation in milliseconds.
     * @param end - The end time of the animation in milliseconds.
     * @param timingFunction - The timing function to use for the animation.
     * @returns The current component instance for method chaining.
     */
    startAnimate(start: number, end: number, timingFunction?: SDTimingFunction): this;
    startAnimate() {
        this.__animationCheck();
        if (arguments.length === 0) return this.startAnimate(this._.start, this._.start + 300);
        if (arguments.length === 1) {
            const object = arguments[0];
            if (typeof object === "number") return this.startAnimate(this._.start, this._.start + object);
            else if (typeof object === "function") return this.startAnimate(this._.start, this._.start + 300, object);
            return this.startAnimate(object.delay(), object.delay() + object.duration(), object._.timingFunction);
        } else if (arguments.length === 2) {
            if (typeof arguments[1] === "function")
                return this.startAnimate(this._.start, this._.start + arguments[0], arguments[1]);
            const [start, end] = arguments;
            return this.startAnimate(start, end, T.easeInOut);
        }
        [this._.start, this._.end, this._.timingFunction] = arguments;
        return this;
    }
    /**
     * Finalizes and applies the current animation sequence.
     * - Call this method after configuring properties with `startAnimate()` to finish the animation.
     * @returns The current component instance for method chaining.
     */
    endAnimate(): this {
        this.__animationCheck();
        this._.start = this._.end;
        return this;
    }
    /**
     * Creates a temporal dependency between animations, either delaying the start
     * of this animation by a specified duration or scheduling it to start
     * immediately after another component's animation completes.
     *
     * @example
     * // Animate rectangles sequentially with temporal dependencies
     * rect1.startAnimate().dx(100).endAnimate();
     * rect2.after(rect1).startAnimate().dx(100).endAnimate();
     * rect3.after(rect2).startAnimate().dx(100).endAnimate();
     *
     * @param delay - The delay in milliseconds before starting the animation,
     *                or an SDNode whose animation completion triggers this animation.
     * @returns This instance for method chaining.
     */
    after(delay_: number | SDNode): this {
        this.__animationCheck();
        const delay = typeof delay_ === "number" ? delay_ : delay_.delay();
        this._.start = delay;
        this._.end = delay;
        return this;
    }
    /**
     * Gets the delay of current animation sequence.
     * This method returns the time offset from the animation's start time.
     * @returns The delay duration in milliseconds.
     */
    delay() {
        this.__animationCheck();
        return this._.start;
    }
    /**
     * Gets the duration of current animation sequence.
     */
    duration() {
        this.__animationCheck();
        return this._.end - this._.start;
    }
    __animationCheck() {
        if (this._.frame === Window.CURRENT_FRAME) return;
        this._.frame = Window.CURRENT_FRAME;
        this._.start = 0;
        this._.end = 0;
    }

    /**
     * Removes this component from the scene.
     * @returns The current component instance for method chaining.
     */
    remove() {
        this._.layer.remove();
    }

    getOpacity(): number {
        return this.vars.opacity;
    }
    setOpacity(opacity: number): this {
        this.vars.mpset("opacity", opacity);
        return this;
    }
    // inRange(point: [number, number]) {
    //     return this.getX() <= point[0] && point[0] <= this.mx() && this.y() <= point[1] && point[1] <= this.my();
    // }

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
        this.vars.scale = [sx, sy];
        return this;
    }
    getScale(): [number, number] {
        return this.vars.scale;
    }
    setRotation(rotate: number): this {
        this.vars.lpset("rotate", rotate);
        return this;
    }
    setTranslate(dx: number, dy: number): this;
    setTranslate(d: [number, number]): this;
    setTranslate(dx: number | [number, number], dy?: number): this {
        if (Array.isArray(dx)) return this.setTranslate(dx[0], dx[1]);
        this.vars.translate = [dx, dy];
        return this;
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
        this.vars.transformOrigin = [x_, y_];
        return this;
    }
    getTransformOrigin(): [number, number] {
        return this.vars.transformOrigin;
    }
    getCenter(): [number, number] {
        return [this.getCenterX(), this.getCenterY()];
    }
    getCenterX(): number {
        return this.getX() + this.getWidth() / 2;
    }
    getCenterY(): number {
        return this.getY() + this.getHeight() / 2;
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
    static __action(node: SDNode, _object: any, key: string, interp: InterpCreator) {
        let object = () => _object;
        if (typeof _object === "string") object = () => node._[_object];
        else if (typeof _object === "function") object = _object;
        return function (vn: any, vo: any) {
            if (Window.ACTION_TICK !== 0) {
                const obj = object();
                if (obj.setAttribute) obj.setAttribute(key, vn);
                else if (obj[key]) obj[key] = vn;
                else throw new Error("Unexpected: unable to set property");
                return;
            }
            new Action(
                node.delay(),
                node.delay() + node.duration(),
                vo,
                vn,
                interp(object(), key),
                node._.timingFunction ?? T.easeInOut,
                node,
                key
            );
        };
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
