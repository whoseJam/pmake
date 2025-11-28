import { Action } from "@/Animate/Action";
import { Context } from "@/Animate/Context";
import { Interp, InterpCreator } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";
import { Dom } from "@/Dom/Dom";
import { SDTimingFunction, TimingFunction as T } from "@/Math/TimingFunction";
import { effect, reactive } from "@/Node/Core/Reactive";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

type ClickCallback = () => void;
type ValueCallback = (value: string) => void;
type DragCallback = (dx: number, dy: number) => [number, number];
type EffectCallback = () => void;
type XL = "x" | "cx" | "mx";
type YL = "y" | "cy" | "my";

export type SDBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export class SDNode {
    id: number;
    vars: any;
    _: {
        frame: number;
        start: number;
        end: number;
        timingFunction: SDTimingFunction;
        layer: RenderNode;
        layers: { [key: string]: RenderNode };
        parent: SDNode;
        children: { [key: string]: SDNode };
        onClick: EventListener;
        onDblClick: EventListener;
        onChange: EventListener;
        onInput: EventListener;
        clickTimeout: NodeJS.Timeout;
        [key: string]: any;
    };
    static NODE_ID = 0;
    static CHILD_ID = 0;
    constructor(target: SDNode | RenderNode) {
        this.id = ++SDNode.NODE_ID;
        this._ = {
            frame: -1,
            start: 0,
            end: 0,
            timingFunction: undefined,
            layer: undefined,
            layers: {},
            parent: undefined,
            children: {},
            onClick: undefined,
            onDblClick: undefined,
            onChange: undefined,
            onInput: undefined,
            clickTimeout: undefined,
            ready: false, // only when ready = true, the action can impact the node
        };

        const targetLayer = target instanceof SDNode ? target.layer() : target;
        this._.layer = RenderNode.createRenderNode(this, targetLayer, "g");

        this.vars = reactive({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
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
    /**
     * Gets the type label of this component.
     * Returns undefined if the type was not defined during component initialization.
     * @returns {string | undefined} The type label if defined; otherwise, undefined.
     */
    type(): string;
    /**
     * Sets the type label for this component.
     * This method should be called during component initialization.
     * @param type - The type label to assign to the component.
     * @returns The current component instance for method chaining.
     */
    type(type: string): this;
    type(type?: string) {
        if (arguments.length === 0) return this._.layer.getAttribute("type");
        this._.layer.setAttribute("type", type);
        return this;
    }
    /**
     * Determines whether the component's aspect ratio is fixed.
     * Components with a fixed aspect ratio include sd.Text and similar elements.
     * Most components do not have a fixed aspect ratio.
     * @returns Returns true if the aspect ratio is fixed; otherwise, false.
     */
    fixAspect() {
        return false;
    }
    /**
     * Gets the default render layer for this component.
     * The layer determines the display order and may affect visual stacking (z-index).
     * @returns The render layer associated with this component.
     */
    layer(): RenderNode;
    /**
     * Gets a named render layer for this component.
     * The layer determines the display order and visual stacking (z-index).
     * @param name - The unique identifier for the render layer.
     * @returns The render layer associated with the specified name.
     */
    layer(name: string): RenderNode;
    layer(name?: string): RenderNode {
        return name === undefined ? this._.layer : this._.layers[name];
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
    /**
     * Attaches this component to a specified target.
     * If the target is a component, this attaches to its default render layer.
     * If the target is a render layer, this attaches directly to that layer.
     * @param target - The component or render layer to which this component will be attached.
     * @returns The current component instance for method chaining.
     */
    attachTo(target: SDNode | RenderNode) {
        if (target instanceof SDNode) this._.layer.moveTo(target.layer());
        else this._.layer.moveTo(target);
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

    effect(name, callback) {
        effect(callback);
        return this;
    }
    /**
     * Removes this component from the scene.
     * @returns The current component instance for method chaining.
     */
    remove() {
        this._.layer.remove();
    }

    clickable(clickable: boolean) {
        // TODO
        return this;
    }
    click<T extends this & SDNode>(this: T) {
        const event = new MouseEvent("click", { button: 1, view: window, bubbles: true, cancelable: true });
        const element = this.layer().element();
        element.dispatchEvent(event);
    }
    onClick(callback: ClickCallback): this;
    onClick(cancel: null | false | undefined): this;
    onClick(callback: ClickCallback | null | false | undefined) {
        const nake = this.layer().element();
        Dom.removeEventListener(nake, "click", this._.onClick);
        if (!callback) return this;
        this._.onClick = () => {
            clearTimeout(this._.timeout);
            this._.clickTimeout = setTimeout(() => {
                callback();
            }, 200);
        };
        Dom.addEventListener(nake, "click", this._.onClick);
        return this;
    }
    onDblClick(callback: ClickCallback): this;
    onDblClick(cancel: null | false | undefined): this;
    onDblClick(callback: ClickCallback | null | false | undefined) {
        const layer = this.layer().element();
        Dom.removeEventListener(layer, "dblclick", this._.onDblClick);
        if (!callback) return this;
        this._.onDblClick = () => {
            clearTimeout(this._.clickTimeout);
            callback();
        };
        Dom.addEventListener(layer, "dblclick", this._.onDblClick);
        return this;
    }
    onChange(callback: ValueCallback): this;
    onChange(cancel: null | false | undefined): this;
    onChange(callback: ValueCallback | null | false | undefined) {
        const layer = this.layer().element();
        Dom.removeEventListener(layer, "change", this._.onChange);
        if (!callback) return this;
        // @ts-ignore
        this._.onChange = (event: Event) => callback(event.target.value);
        Dom.addEventListener(layer, "change", this._.onChange);
        return this;
    }
    onInput(callback: ValueCallback): this;
    onInput(cancel: null | false | undefined): this;
    onInput(callback: ValueCallback | null | false | undefined) {
        const layer = this.layer().element();
        Dom.removeEventListener(layer, "input", this._.onInput);
        if (callback) {
            // @ts-ignore
            this._.onInput = (event: Event) => callback(event.target.value);
            Dom.addEventListener(layer, "input", this._.onInput);
        }
        return this;
    }
    drag(callback: DragCallback): this;
    drag(cancel: null | false | undefined): this;
    drag<T extends this & SDNode>(this: T, callback: DragCallback | null | false | undefined) {
        const layer = this.layer().element() as SVGGElement;
        if (typeof callback === "function" || arguments.length === 0) {
            let currentX = 0;
            let currentY = 0;
            let lastDx = 0;
            let lastDy = 0;
            // @ts-ignore
            Snap(layer).drag(
                function (dx: number, dy: number) {
                    let screenDx = (dx - lastDx) / Window.RATE;
                    let screenDy = (dy - lastDy) / Window.RATE;
                    if (typeof callback === "function") {
                        [screenDx, screenDy] = callback(screenDx, screenDy);
                    }
                    lastDx = dx;
                    lastDy = dy;
                    currentX += screenDx;
                    currentY += screenDy;
                    const transform = `matrix(1,0,0,1,${currentX},${currentY})`;
                    layer.setAttribute("transform", transform);
                },
                function () {
                    if (layer.transform.baseVal.length > 0) {
                        currentX = layer.transform.baseVal.getItem(0).matrix.e;
                        currentY = layer.transform.baseVal.getItem(0).matrix.f;
                        lastDx = 0;
                        lastDy = 0;
                    }
                }
            );
            return this;
        }
        // @ts-ignore
        Snap(layer).undrag();
        return this;
    }
    opacity(): number;
    opacity(opactiy: number): this;
    opacity(opacity?: number) {
        if (arguments.length === 0) return this.vars.opacity;
        Check.validateOpacity(opacity, `${this.constructor.name}.opacity`);
        this.vars.mpset("opacity", opacity);
        return this;
    }
    inRange(point: [number, number]) {
        return this.x() <= point[0] && point[0] <= this.mx() && this.y() <= point[1] && point[1] <= this.my();
    }
    x(): number;
    x(x: number): this;
    x(x?: number) {
        if (arguments.length === 0) return this.vars.x;
        Check.validateNumber(x, `${this.constructor.name}.x`);
        this.vars.lpset("x", x);
        return this;
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        if (arguments.length === 0) return this.vars.y;
        Check.validateNumber(y, `${this.constructor.name}.y`);
        this.vars.lpset("y", y);
        return this;
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.vars.width;
        Check.validateNumber(width, `${this.constructor.name}.width`);
        this.vars.lpset("width", width);
        return this;
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.vars.height;
        Check.validateNumber(height, `${this.constructor.name}.height`);
        this.vars.lpset("height", height);
        return this;
    }
    scale(scale: number): this;
    scale(sx: number, sy: number): this;
    scale(s: [number, number]): this;
    scale(sx?: number | [number, number], sy?: number): this {
        if (arguments.length === 1) {
            if (Array.isArray(sx)) return this.scale(sx[0], sx[1]);
            return this.scale(sx, sx);
        }
        Check.validateNumber(sx, `${this.constructor.name}.scale`, 1);
        Check.validateNumber(sy, `${this.constructor.name}.scale`, 2);
        this.vars.scale = [sx, sy];
        return this;
    }
    rotate(rotate: number): this;
    rotate(rotate?: number) {
        if (arguments.length === 0) return this.vars.rotate;
        Check.validateNumber(rotate, `${this.constructor.name}.rotate`);
        this.vars.lpset("rotate", rotate);
        return this;
    }
    translate(dx: number, dy: number): this;
    translate(d: [number, number]): this;
    translate(dx: number | [number, number], dy?: number) {
        if (Array.isArray(dx)) return this.translate(dx[0], dx[1]);
        Check.validateNumber(dx, `${this.constructor.name}.translate`, 1);
        Check.validateNumber(dy, `${this.constructor.name}.translate`, 2);
        this.vars.translate = [dx, dy];
        return this;
    }
    transformOrigin(x: number, y: number): this;
    transformOrigin(origin: [number, number]): this;
    transformOrigin(): [number, number];
    transformOrigin(x?: number | [number, number], y?: number) {
        if (arguments.length === 0) return this.vars.transformOrigin;
        if (Array.isArray(x)) return this.transformOrigin(x[0], x[1]);
        Check.validateNumber(x, `${this.constructor.name}.transformOrigin`, 1);
        Check.validateNumber(y, `${this.constructor.name}.transformOrigin`, 2);
        this.vars.transformOrigin = [x, y];
        return this;
    }
    pos(x: number, y: number): this;
    pos(point: [number, number]): this;
    pos(x: XL, y: YL, dx?: number, dy?: number): [number, number];
    pos(x: number | [number, number] | XL, y?: number | YL, dx = 0, dy = 0) {
        if (typeof x === "number" && typeof y === "number") return this.x(x).y(y);
        if (Array.isArray(x)) return this.pos(x[0], x[1]);
        return [this[x]() + dx, this[y]() + dy];
    }
    position() {
        return this.pos.apply(this, arguments);
    }
    center(): [number, number];
    center(cx: number, cy: number): this;
    center(point: [number, number]): this;
    center(cx?: number | [number, number], cy?: number) {
        if (arguments.length === 0) return this.pos("cx", "cy");
        if (arguments.length === 1) return this.center(cx[0], cx[1]);
        return this.cx(cx as number).cy(cy);
    }
    kx(k: number) {
        return this.x() + this.width() * k;
    }
    ky(k: number) {
        return this.y() + this.height() * k;
    }
    dx(dx: number) {
        return this.x(this.x() + dx);
    }
    dy(dy: number) {
        return this.y(this.y() + dy);
    }
    cx(): number;
    cx(cx: number): this;
    cx(cx?: number) {
        if (arguments.length === 0) return this.kx(0.5);
        return this.x(cx - this.width() * 0.5);
    }
    cy(): number;
    cy(cy: number): this;
    cy(cy?: number) {
        if (arguments.length === 0) return this.ky(0.5);
        return this.y(cy - this.height() * 0.5);
    }
    mx(): number;
    mx(mx: number): this;
    mx(mx?: number) {
        if (arguments.length === 0) return this.kx(1);
        return this.x(mx - this.width());
    }
    my(): number;
    my(my: number): this;
    my(my?: number) {
        if (arguments.length === 0) return this.ky(1);
        return this.y(my - this.height());
    }
    boundingBox(): SDBox;
    boundingBox(box: SDBox): this;
    boundingBox(x: number, y: number, width: number, height: number): this;
    boundingBox(x?: number | SDBox, y?: number, width?: number, height?: number) {
        if (arguments.length === 0) {
            return {
                x: this.x(),
                y: this.y(),
                width: this.width(),
                height: this.height(),
            };
        }
        if (arguments.length === 1) {
            const box = x as SDBox;
            return this.boundingBox(box.x, box.y, box.width, box.height);
        }
        return this.width(width)
            .height(height)
            .x(x as number)
            .y(y);
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
        const context = new Context(this);
        context.till(0, 0);
        this.opacity(0);
        context.till(0, 1);
        this.opacity(1);
        return this;
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
        const context = new Context(this);
        context.till(0, 0);
        this.opacity(1);
        context.till(0, 1);
        this.opacity(0);
        return this;
    }
    zoomIn() {
        const context = new Context(this);
        context.till(0, 0);
        const width = this.width();
        const height = this.height();
        this.scale(0.001);
        context.till(0, 1);
        this.width(width).height(height).opacity(1);
        return this;
    }
    zoomOut() {
        this.scale(0.001).opacity(1);
        return this;
    }
    fadeIn() {
        const context = new Context(this);
        context.till(0, 0);
        this.opacity(0);
        context.till(0, 1);
        this.opacity(1);
        return this;
    }
    fadeOut() {
        const context = new Context(this);
        context.till(0, 0);
        this.opacity(1);
        context.till(0, 1);
        this.opacity(0);
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
    static __action(node: SDNode, _object: any, key: string, interp: InterpCreator) {
        let object = () => _object;
        if (typeof _object === "string") object = () => node._[_object];
        else if (typeof _object === "function") object = _object;
        return function (vn: any, vo: any) {
            if (global.ACTION_TICK !== 0) {
                const obj = object();
                if (obj.setAttribute) obj.setAttribute(key, vn);
                else if (obj[key]) obj[key] = vn;
                else ErrorLauncher.whatHappened();
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
