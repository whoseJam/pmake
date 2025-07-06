import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDRule } from "@/Rule/Rule";
import { SDColor } from "@/Utility/Color";

/**
 * BaseElement serves as an element component that wraps an inner component with a background component.
 * The inner component is called value component and is centered by default.
 *
 * When referring to element component properties (e.g. fill, stroke, color), these typically affect the background component,
 * not the value component.
 */
export class BaseElement extends SD2DNode {
    /**
     * Renders the component onto the specified target.
     * The target can be another component or a canvas element (e.g., SVG, div).
     * If a value is provided, it will be centered within the element component by default.
     * @param target - The destination to render the component.
     * @param value - Optional data value to watch with this component instance.
     *                If omitted, the component will be centered within the target.
     */
    constructor(target: SDNode | RenderNode, value?: any);

    /**
     * Gets the visual representation scaling factor of this element component.
     * @returns The scaling factor used for proportional sizing.
     */
    rate(): number;
    /**
     * Sets the visual representation scaling factor of this element component. Default to `1.2`.
     *
     * This method adjusts the perceived size of the component's value display.
     * A higher rate value results in a smaller visual representation, while a lower
     * rate increases the perceived size. This is useful for maintaining proportional
     * scaling across different component instances.
     * @param rate - The scaling factor to apply.
     * @returns The current component instance for method chaining.
     */
    rate(rate: number): this;
    /**
     * Gets the color of this element component.
     * @returns The color.
     */
    color(): SDColor;
    /**
     * Sets the color of this element component.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    color(color: string | SDColor): this;
    /**
     * Gets the fill color of this element component.
     * @returns The fill color.
     */
    fill(): string;
    /**
     * Sets the fill color of this element component.
     * @param fill - The fill color to apply.
     * @returns The current component instance for method chaining.
     */
    fill(fill: string): this;
    /**
     * Gets the fill opacity of this element component.
     * @returns The fill opacity.
     */
    fillOpacity(): number;
    /**
     * Sets the fill opacity of this element component.
     * @param opacity - The fill opacity to apply.
     * @returns The current component instance for method chaining.
     */
    fillOpacity(opacity: number): this;
    /**
     * Gets the stroke color of this element component.
     * @returns The stroke color.
     */
    stroke(): string;
    /**
     * Sets the stroke color of this element component. Default to `C.black`.
     * @param stroke - The stroke color to apply.
     * @returns The current component instance for method chaining.
     */
    stroke(stroke: string): this;
    /**
     * Gets the stroke opacity of this element component.
     * @returns The stroke opacity.
     */
    strokeOpacity(): number;
    /**
     * Sets the stroke opacity of this element component.
     * @param opacity - The stroke opacity to apply.
     * @returns The current component instance for method chaining.
     */
    strokeOpacity(opacity: number): this;
    /**
     * Gets the stroke width of this element component.
     * @returns The stroke width.
     */
    strokeWidth(): number;
    /**
     * Sets the stroke width for this element component. Default to `1`.
     * @param width - The stroke width to apply.
     * @returns The current component instance for method chaining.
     */
    strokeWidth(width: number): this;
    /**
     * Gets the background component of this element component.
     * @returns The background component instance.
     */
    background(): any;
    /**
     * Casts the value component to its string representation.
     * - If the value component does not exist, returns an empty string ("").
     * - If the value component cannot be casted to a string, throws an Error.
     * @returns The string representation of the value component.
     */
    text(): string;
    /**
     * Sets the text content of the value component.
     * - If the value component does not exist, creates a new **`sd.Text`** instance to hold the text.
     * - If the value component value does not support text formatting, throws an Error.
     * @param text - The text content to apply.
     * @returns The current component instance for method chaining.
     */
    text(text: number | string): this;
    /**
     * Casts the value component to its integer representation.
     * - If the value component does not exists, returns zero.
     * - If the value component cannot be casted to an integer, throws an Error.
     * @returns The integer representation of the value component.
     */
    intValue(): number;
    /**
     * Gets the value component of this element component.
     * @returns The value component instance, or undefined if no value component has been set.
     */
    value(): any;
    /**
     * Sets the value component of this element component.
     * - Replaces any existing value component with the provided value.
     * - Removes the current value without replacement if provided value is null or undefined.
     * - Converts to **`sd.Text`** instance if provided value is number or string.
     * @param value - The provided value.
     * @param rule - Optional responsive rule.
     * @returns The current component instance for method chaining.
     */
    value(value: any, rule?: SDRule): this;
    /**
     * Sets the value component of this element component with an animated transition from its current position.
     *
     * Unlike standard value assignment, this method animates the movement of value component
     * from its original position to the new target position within the element component.
     * @param value - The provided value component.
     * @param rule - Optional responsive rule.
     * @returns The current component instance for method chaining.
     */
    valueFromExist(value: SDNode, rule?: SDRule): this;
    /**
     * Detaches the value component from this element component while preserving it in the scene.
     * - Removes association between the value component and this element component.
     * - Leaves the value component present in the scene.
     * - Returns the detached component for potential reuse.
     * @returns The detached value component instance, or undefined if no value component was present.
     */
    drop(): any;
}
