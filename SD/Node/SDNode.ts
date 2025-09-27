import { Action } from "@/Animate/Action";
import { Interp } from "@/Animate/Interp";
import { Window } from "@/Animate/Window";
import { Dom } from "@/Dom/Dom";
import { Enter as EN, EnterCallback } from "@/Node/Core/Enter";
import { Exit as EX, ExitCallback } from "@/Node/Core/Exit";
import { effect, reactive, uneffect } from "@/Node/Core/Reactive";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDRule } from "@/Rule/Rule";
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
        layer: RenderNode;
        layers: { [key: string]: RenderNode };
        parent: SDNode;
        children: { [key: string]: SDNode };
        onClick: EventListener;
        onDblClick: EventListener;
        onChange: EventListener;
        onInput: EventListener;
        clickTimeout: NodeJS.Timeout;
        updaters: { [key: string]: any };
        freezing: number;
        enter: EnterCallback;
        exit: ExitCallback;
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
            updaters: {},
            freezing: 0,
            enter: undefined,
            exit: undefined,
        };

        const targetLayer = target instanceof SDNode ? target.layer() : target;
        this._.layer = RenderNode.createRenderNode(this, targetLayer, "g");

        this.vars = reactive({
            opacity: 1,
        });

        this.vars.watch("opacity", (vn: number, vo: number) => {
            new Action(this.delay(), this.delay() + this.duration(), vo, vn, Interp.opacityInterp(this.layer(), "opacity"), this, "opacity");
        });
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
     * @returns The current component instance for method chaining.
     */
    startAnimate(start: number, end: number): this;
    startAnimate() {
        this.__animationCheck();
        if (arguments.length === 0) return this.startAnimate(this._.start, this._.start + 300);
        if (arguments.length === 1) {
            const object = arguments[0];
            if (typeof object === "number") return this.startAnimate(this._.start, this._.start + object);
            return this.startAnimate(object.delay(), object.delay() + object.duration());
        }
        [this._.start, this._.end] = arguments;
        this.__forEachChild(child => child.startAnimate(this._.start, this._.end));
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
        this.__forEachChild(child => child.endAnimate());
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
        this.__forEachChild(child => child.after(delay));
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
    private __animationCheck() {
        if (this._.frame === Window.CURRENT_FRAME) return;
        this._.frame = Window.CURRENT_FRAME;
        this._.start = 0;
        this._.end = 0;
    }

    childAs(child: SDNode, rule?: SDRule): this;
    childAs(name: string, child: SDNode, rule?: SDRule): this;
    childAs(name: string | SDNode, child?: SDNode | SDRule, rule?: SDRule) {
        const name_ = typeof name === "string" || typeof name === "number" ? String(name) : "child__" + String(++SDNode.CHILD_ID);
        const child_ = name instanceof SDNode ? name : (child as SDNode);
        const rule_ = typeof child === "function" ? child : rule;
        if (!child_.onEnter()) child_.onEnter(EN.appear());
        if (rule_) this.tryUpdate(child_, () => this.__pushChild(name_, child_, rule_));
        else this.__pushChild(name_, child_, rule_);
        return this;
        // const update = () => {
        //     if (child._.parent !== this && !child.onEnter()) child.attachTo(this);
        //     this.__pushChild(args[0], args[1], args[2]);
        // };
        // if (!child.onEnter()) child.onEnter(EN.appear());
        // if (rule) this.tryUpdate(child, update);
        // else update();
        // return this;
    }
    child(name: string) {
        return this._.children[name];
    }
    __forEachChild(callback: (child: SDNode, id: string) => void) {
        for (const id in this._.children) callback(this._.children[id], id);
    }
    __pushChild(name_: string, child: SDNode, rule?: SDRule) {
        const name = typeof name_ === "string" ? name_ : String(++SDNode.CHILD_ID);
        child._.parent = this;
        this._.children[name] = child;
        child.rule(rule);
        return name;
    }
    /**
     * Removes a child component from this component.
     * @param child - The identifier or instance of the child component to remove.
     * @returns The removed child component if it existed; otherwise, undefined.
     */
    eraseChild(child: string | SDNode) {
        const child_ = typeof child === "string" ? this._.children[child] : child;
        const name = Object.keys(this._.children).find(key => this._.children[key] === child);
        if (name === undefined) return undefined;
        if (!child_.onExit()) child_.onExit(EX.fade());
        child_.triggerExit();
        if (child_.rule()) child_.eraseRule();
        child_._.parent = undefined;
        delete this._.children[name];
        return child;
    }
    /**
     * Checks if a child component exists within this component.
     * @param child - The identifier or instance of the child component to check.
     * @returns Returns true if the chidl exists; otherwise, false.
     */
    hasChild(child: string | SDNode) {
        const child_ = typeof child === "string" ? this._.children[child] : child;
        const name = Object.keys(this._.children).find(key => this._.children[key] === child_);
        return name !== undefined;
    }
    /**
     * Removes this component from the scene.
     * @returns The current component instance for method chaining.
     */
    remove() {
        this._.layer.remove();
    }
    freeze() {
        this._.freezing++;
        for (const key in this._.updaters) this._.updaters[key].freeze();
        // this.vars.freeze();
        return this;
    }
    unfreeze() {
        this._.freezing--;
        for (const key in this._.updaters) this._.updaters[key].unfreeze();
        // this.vars.unfreeze();
        return this;
    }
    freezing() {
        return this._.freezing > 0;
    }
    /**
     * Gets the responsive rule of this component.
     * @returns The responsive rule.
     */
    rule(): SDRule;
    /**
     * Sets the responsive rule of this component.
     *
     * In most cases it is suggested to define the responsive rule via `childAs`.
     * @param rule - The responsive rule to apply.
     * @returns The current component instance for method chaining.
     * @example
     * // Defines a custom responsive rule.
     * parent.childAs(child, (parent, child) => {
     *     child.center(parent.center());
     * });
     * // Use a preset layout rule.
     * parent.childAs(child, R.aside("rc")); // right center.
     */
    rule(rule: SDRule): this;
    rule(rule?: SDRule) {
        if (rule === undefined) return this._.rule;
        this._.rule = effect(() => {
            // @ts-ignore
            rule(this._.parent, this);
        });
        return this;
    }
    /**
     * Removes the responsive rule of this component.
     * @returns The current component instance for method chaining.
     */
    eraseRule() {
        if (!this.rule()) return this;
        uneffect(this._.rule);
        this._.rule = undefined;
        return this;
    }
    /**
     * Defines a responsive effect on this component.
     *
     * This method is intended for advanced use cases requiring deep customization.
     * In most cases prefer using responsive rules instead of responsive effects.
     * @param name - The name of the responsive effect.
     * @param callback - The effect.
     * @returns The current component instance for method chaining.
     */
    effect(name: string, callback: EffectCallback) {
        if (arguments.length === 1) return this._.updaters[name];
        this._.updaters[name] = effect(callback);
        return this;
    }
    /**
     * Removes a specified responsive effect on this component.
     * @param name - The name of the responsive effect.
     * @returns The current component instance for method chaining.
     */
    uneffect(name: string) {
        uneffect(this._.updaters[name]);
        delete this._.updaters[name];
        return this;
    }
    /**
     * Removes all responsive effect on this component.
     * @returns The current component instance for method chaining.
     */
    uneffectAll() {
        for (const name in this._.updaters) this.uneffect(name);
        return this;
    }
    /**
     * Triggers a specified responsive effect defined on this component.
     *
     * In most cases responsive effects are to activate automatically by the responsive system.
     * Do not use this method unless you truely understand what are you doing.
     * @param name - The name of the effect to be triggered.
     * @returns The current component instance for method chaining.
     */
    triggerEffect(name: string) {
        this._.updaters[name].trigger();
        return this;
    }
    hasEffect(name: string) {
        return this._.updaters[name] !== undefined;
    }
    onEnter(): EnterCallback;
    onEnter(enter: EnterCallback): this;
    onEnter(enter?: EnterCallback) {
        if (arguments.length === 0) return this._.enter;
        this._.enter = enter;
        return this;
    }
    onEnterDefault(enter: EnterCallback) {
        if (!this._.enter) this._.enter = enter;
        return this;
    }
    triggerEnter(parent: SDNode, move: () => void) {
        if (!this._.enter) return this;
        this._.entering = true;
        this._.enter.call(parent, this, move);
        this._.entering = this._.enter = undefined;
        return this;
    }
    entering() {
        return this._.entering !== undefined;
    }
    onExit(): ExitCallback;
    onExit(exit: ExitCallback): this;
    onExit(exit?: ExitCallback) {
        if (arguments.length === 0) return this._.exit;
        this._.exit = exit;
        return this;
    }
    onExitDefault(exit: ExitCallback) {
        if (!this._.exit) this._.exit = exit;
        return this;
    }
    triggerExit() {
        if (!this._.exit) return this;
        this._.exit.call(this._.parent, this);
        this._.exit = undefined;
        return this;
    }
    tryUpdate(element, update) {
        if (element.onEnter()) {
            element.triggerEnter(this, update);
        } else update();
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
        Snap(nake).undrag();
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
    x(x?: number): number | this {
        ErrorLauncher.notImplementedYet(`${this.constructor.name}.x`);
        return;
    }
    y(): number;
    y(y: number): this;
    y(y?: number): number | this {
        ErrorLauncher.notImplementedYet(`${this.constructor.name}.y`);
        return;
    }
    width(): number;
    width(width: number): this;
    width(width?: number): number | this {
        ErrorLauncher.notImplementedYet(`${this.constructor.name}.width`);
        return;
    }
    height(): number;
    height(height: number): this;
    height(height?: number): number | this {
        ErrorLauncher.notImplementedYet(`${this.constructor.name}.height`);
        return;
    }
    scale(scale: number) {
        if (this.fixAspect()) return this.width(this.width() * scale);
        return this.freeze()
            .width(this.width() * scale)
            .height(this.height() * scale)
            .unfreeze();
    }
    pos(x: number, y: number): this;
    pos(point: [number, number]): this;
    pos(x: XL, y: YL, dx?: number, dy?: number): [number, number];
    pos(x: number | [number, number] | XL, y?: number | YL, dx = 0, dy = 0) {
        if (typeof x === "number" && typeof y === "number") return this.freeze().x(x).y(y).unfreeze();
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
        return this.freeze()
            .cx(cx as number)
            .cy(cy)
            .unfreeze();
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
        return this.freeze()
            .width(width)
            .height(height)
            .x(x as number)
            .y(y)
            .unfreeze();
    }
}

type AnyFunction = (...args: any[]) => any;
export type SDNodeWithColor = SDNode & { color: AnyFunction };
export type SDNodeWithDrop = SDNode & { drop: AnyFunction };
export type SDNodeWithIntValue = SDNode & { intValue: AnyFunction };
export type SDNodeWithText = SDNode & { text: AnyFunction };
export type SDNodeWithValue = SDNode & { value: AnyFunction };
