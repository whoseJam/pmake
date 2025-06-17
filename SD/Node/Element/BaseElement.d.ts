import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDRule } from "@/Rule/Rule";
import { SDColor } from "@/Utility/Color";

export class BaseElement extends SD2DNode {
    /**
     * Renders the component onto the specified target.
     * The target can be another component or a canvas element (e.g., SVG, div).
     * If a value is provided, it will be centered within the element component by default.
     * @param target - The destination to render the component.
     * @param value - Optional data value to associate with this component instance.
     *                If omitted, the component will be centered within the target.
     */
    constructor(target: SDNode | RenderNode, value?: any);

    /**
     * Retrieves the scaling factor applied to this component.
     * @returns The scaling factor used for proportional sizing.
     */
    rate(): number;
    /**
     * Sets the scaling factor of this component's visual representation.
     *
     * This method adjusts the perceived size of the component's value display.
     * A higher rate value results in a smaller visual representation, while a lower
     * rate increases the perceived size. This is useful for maintaining proportional
     * scaling across different component instances.
     * @param rate - The scaling rate to apply. Must be a positive number.
     *               Larger values reduce the visual size; smaller values increase it.
     * @returns The current component instance for method chaining.
     */
    rate(rate: number): this;
    /**
     * Retrieves the base color applied to this element.
     * @returns The base color value of the element.
     */
    color(): SDColor;
    /**
     * Sets the color of this element.
     *
     * This method sets the primary color value for the element's background appearance.
     * Note that this color setting affects only the element itself and does not
     * influence the color of any nested components.
     * @param color - The base color to apply to the element.
     * @returns The current component instance for method chaining.
     */
    color(color: SDColor | string): this;
    /**
     * Retrieves the fill color applied to this element.
     * @returns The current fill color value.
     */
    fill(): string;
    /**
     * Sets the fill color of this element.
     *
     * This method sets the color used to fill the element's background.
     * Note that this color setting affects only the element itself and does not
     * influence the color of any nested components.
     * @param fill - The hexadecimal color value to apply as the fill.
     * @returns The current component instance for method chaining.
     */
    fill(fill: string): this;
    /**
     * Retrieves the opacity of this element's fill color.
     * @returns The fill opacity, ranging from 0 (fully transparent) to 1 (fully opaque).
     */
    fillOpacity(): number;
    /**
     * Sets the opacity of this element's fill color.
     * @param opacity - The opacity to apply, ranging from 0 (fully transparent) to 1 (fully opaque).
     * @returns The current component instance for method chaining.
     */
    fillOpacity(opacity: number): this;
    /**
     * Retrieves the stroke color applied to this element.
     * @returns The current stroke color value.
     */
    stroke(): string;
    /**
     * Sets the stroke color of this element.
     *
     * This method sets the color used to stroke the element's background.
     * Note that this color setting affects only the element itself and does not
     * influence the color of any netsed components.
     * @param stroke - The hexadecimal color value to apply as the stroke.
     * @returns The current component instance for method chaining.
     */
    stroke(stroke: string): this;
    /**
     * Retrieves the opacity of this element's stroke color.
     * @returns The stroke opacity, ranging from 0 (fully transparent) to 1 (fully opaque).
     */
    strokeOpacity(): number;
    /**
     * Sets the opacity of this element's stroke color.
     * @param opacity - The opacity to apply, ranging from 0 (fully transparent) to 1 (fully opaque).
     * @returns The current component instance for method chaining.
     */
    strokeOpacity(opacity: number): this;
    /**
     * Retrieves the stroke width of this element.
     * @returns The stroke width value in pixels.
     */
    strokeWidth(): number;
    /**
     * Sets the stroke width for this element.
     *
     * This method sets the stroke width of the element's background.
     * Note that this stroke width setting affects only the element itself and dose not
     * influence the stroke width of any nested components.
     * @param width - The width value to apply in pixels.
     * @returns The current component instance for method chaining.
     */
    strokeWidth(width: number): this;

    /**
     * Retrieves the background component of this element.
     *
     * Every element is guaranteed to have a background component,
     * which can be styled independently with fill, opacity, etc.
     * @returns The background component instance.
     */
    background(): BaseShape;

    /**
     * Casts the value inside this element to its string representation.
     * - If the value does not exist, returns an empty string ("").
     * - If the value cannot be casted to a string, throws an Error.
     * @returns The string representation of the value.
     */
    text(): string;
    /**
     * Sets the text content of the value inside this element.
     * - If no value exists, creates a new **`sd.Text`** instance to hold the text.
     * - If the current value does not support text formatting, throws a TypeError.
     * @param text - The text content to set.
     * @returns The current component instance for method chaining.
     */
    text(text: number | string): this;
    /**
     * Casts the value inside this element to its integer representation.
     * - If the value does not exists, returns zero.
     * - If the value cannot be casted to an integer, throws an Error.
     * @Returns The integer representation of the value.
     */
    intValue(): number;
    /**
     * Retrieves the value component of this element.
     * @returns The value component instance, or undefined if no value has been set.
     */
    value(): SD2DNode | undefined;
    /**
     * Sets the value component inside this element.
     * - Replaces any existing value component with the provided content.
     * - If `value` is null/undefined, removes the current value without replacement.
     * - Non-SDNode value is automatically converted to **`sd.Text`** instance.
     * @param value - The content to set as the value.
     * @param rule - Optional responsive rule defining the parent-child relationship between the element and its value.
     * @returns The current component instance for method chaining.
     */
    value(value: any, rule?: SDRule): this;
    /**
     * Sets the value component with an animated transition from its current position.
     *
     * Unlike standard value assignment, this method animates the value component's movement
     * from its original position to the new target position within the element.
     * @param value - The SD2DNode to set as the value component.
     * @param rule - Optional responsive rule defining the parent-child relationship between the element and its value.
     * @returns The current component instance for method chaining.
     */
    valueFromExist(value: SD2DNode, rule?: SDRule): this;
    /**
     * Detaches the value component from this element while preserving it in the scene.
     *
     * Unlike `value(null)`, which removes the value from both the element and the scene,
     * this method:
     * - Removes the value component's association with this element
     * - Leaves the value component present in the scene
     * - Returns the detached component for potential reuse
     * @returns The detached SD2DNode instance, or undefined if no value was present.
     */
    drop(): SD2DNode | undefined;
}
