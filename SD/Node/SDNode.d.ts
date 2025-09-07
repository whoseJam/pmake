import { RenderNode } from "@/Renderer/RenderNode";
import { SDRule } from "@/Rule/Rule";

type XLocator = "x" | "cx" | "mx";
type YLocator = "y" | "cy" | "my";
type Box = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export class SDNode {
    _: Record<string, any>;
    vars: any;

    /**
     * Renders the component onto the specified target.
     * The target can be another component or a canvas element (e.g., svg, div).
     * @param target - The destination to render the component.
     */
    constructor(target: SDNode | RenderNode);

    /**
     * Gets the type label of this component.
     * Returns undefined if the type was not defined during component initialization.
     * @returns {string | undefined} The type label if defined; otherwise, undefined.
     */
    type(): string | undefined;
    /**
     * Sets the type label for this component.
     * This method should be called during component initialization.
     * @param type - The type label to assign to the component.
     * @returns The current component instance for method chaining.
     */
    type(type: string): this;
    /**
     * Determines whether the component's aspect ratio is fixed.
     * Components with a fixed aspect ratio include sd.Text and similar elements.
     * Most components do not have a fixed aspect ratio.
     * @returns Returns true if the aspect ratio is fixed; otherwise, false.
     */
    fixAspect(): boolean;
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
    /**
     * Creates a new named render layer on this component.
     * Newly created layers are stacked above existing ones.
     * @param name - The unique identifier for the new layer.
     * @returns The current component instance for method chaining.
     */
    newLayer(name: string): this;
    /**
     * Attaches this component to a specified target.
     * If the target is a component, this attaches to its default render layer.
     * If the target is a render layer, this attaches directly to that layer.
     * @param target - The component or render layer to which this component will be attached.
     * @returns The current component instance for method chaining.
     */
    attachTo(target: SDNode | RenderNode): this;

    /**
     * Appends a child component to this component.
     * @param name - identifier for the child component. Used to retrieve the child via its name later.
     * @param child - The child component to append.
     * @param rule - Optional responsive rule defining the parent-child relationship.
     * @returns The current component instance for method chaining.
     */
    childAs(name: number | string, child: SDNode, rule?: SDRule): this;
    childAs(child: SDNode, rule?: SDRule): this;
    /**
     * Gets a child component by its identifier.
     * @param name - The unique identifier assigned to the child component.
     * @returns The child component associated with the specified name.
     */
    child(name: number | string): SDNode;
    /**
     * Checks if a child component exists within this component.
     * @param child - The identifier or instance of the child component to check.
     * @returns Returns true if the chidl exists; otherwise, false.
     */
    hasChild(child: number | string | SDNode): boolean;
    /**
     * Removes a child component from this component.
     * @param child - The identifier or instance of the child component to remove.
     * @returns The removed child component if it existed; otherwise, undefined.
     */
    eraseChild(child: number | string | SDNode): SDNode | undefined;
    /**
     * Removes this component from the scene.
     * @returns The current component instance for method chaining.
     */
    remove(): this;
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
    /**
     * Finalizes and applies the current animation sequence.
     * - Call this method after configuring properties with `startAnimate()` to finish the animation.
     * @returns The current component instance for method chaining.
     */
    endAnimate(): this;
    /**
     * Gets the delay of current animation sequence.
     * This method returns the time offset from the animation's start time.
     * @returns The delay duration in milliseconds.
     */
    delay(): number;
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
    after(delay: number | SDNode): this;
    /**
     * Gets the duration of current animation sequence.
     */
    duration(): number;

    freeze(): this;
    unfreeze(): this;
    freezing(): boolean;
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
    /**
     * Removes the responsive rule of this component.
     * @returns The current component instance for method chaining.
     */
    eraseRule(): this;
    /**
     * Defines a responsive effect on this component.
     *
     * This method is intended for advanced use cases requiring deep customization.
     * In most cases prefer using responsive rules instead of responsive effects.
     * @param name - The name of the responsive effect.
     * @param callback - The effect.
     * @returns The current component instance for method chaining.
     */
    effect(name: string, callback: () => void): this;
    /**
     * Removes a specified responsive effect on this component.
     * @param name - The name of the responsive effect.
     * @returns The current component instance for method chaining.
     */
    uneffect(name: string): this;
    /**
     * Removes all responsive effect on this component.
     * @returns The current component instance for method chaining.
     */
    uneffectAll(): this;
    /**
     * Triggers a specified responsive effect defined on this component.
     *
     * In most cases responsive effects are to activate automatically by the responsive system.
     * Do not use this method unless you truely understand what are you doing.
     * @param name - The name of the effect to be triggered.
     * @returns The current component instance for method chaining.
     */
    triggerEffect(name: string): this;
    hasEffect(name: string): boolean;

    drag(type: true | false | null | undefined): this;
    drag(onDrag: (dx: number, dy: number) => [number, number]): this;
    clickable(type: true | false | null | undefined): this;
    click(): this;
    onClick(onClick: false | null | undefined): this;
    onClick(onClick: (node: this) => void): this;
    dblClick(): this;
    onDblClick(onClick: false | null | undefined): this;
    onDblClick(onClick: (node: this) => void): this;

    onEnter(): (element: SDNode) => void | undefined;
    onEnter(enter: (element: SDNode, move: () => void) => void): this;
    onEnterDefault(enter: (element: SDNode, move: () => void) => void): this;
    triggerEnter(): this;
    entering(): boolean;
    onExit(): (element: SDNode) => void | undefined;
    onExit(exit: (element: SDNode) => void): this;
    onExitDefault(exit: (element: SDNode) => void): this;
    triggerExit(): this;
    tryUpdate(element: SDNode, update: () => void): void;

    opacity(): number;
    opacity(opacity: number): this;
    inRange(point: [number, number]): boolean;
    x(): number;
    x(x: number): this;
    y(): number;
    y(y: number): this;
    cx(): number;
    cx(cx: number): this;
    cy(): number;
    cy(cy: number): this;
    mx(): number;
    mx(mx: number): this;
    my(): number;
    my(my: number): this;
    width(): number;
    width(width: number): this;
    height(): number;
    height(height: number): this;
    scale(scale: number): this;
    pos(x: number, y: number): this;
    pos(x: XLocator, y: YLocator, dx?: number, dy?: number): this;
    position(x: number, y: number): this;
    position(x: XLocator, y: YLocator, dx?: number, dy?: number): this;
    center(): [number, number];
    center(cx: number, cy: number): this;
    center(center: [number, number]): this;
    kx(k: number): number;
    ky(k: number): number;
    dx(dx: number): this;
    dy(dy: number): this;
    boundingBox(): Box;
    boundingBox(box: Box): this;
    boundingBox(x: number, y: number, width: number, height: number): this;
}

type AnyFunction = (...args: any[]) => any;

export type SDNodeWithText = SDNode & { text: AnyFunction };
export type SDNodeWithColor = SDNode & { color: AnyFunction };
