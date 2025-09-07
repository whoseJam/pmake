import { SDSVGNode } from "@/Node/SDSVGNode";
import { SDRule } from "@/Rule/Rule";
import { SDColor } from "@/Utility/Color";

/**
 * BasePath servers as a path component that can has an inner component along its path.
 * The inner component is called value component and is positioned at the midpoint of path by default.
 *
 * When referring to path component properties (e.g. fill, stroke, color), these typically affect the path component,
 * not the value component.
 */
export class BasePath extends SDSVGNode {
    /**
     * Gets the fill color of this path component.
     * @returns The fill color.
     */
    fill(): string;
    /**
     * Sets the fill color of this path component. Defaults to 'C.white'.
     * @param fill - The fill color to apply.
     * @returns The current component instance for method chaining.
     */
    fill(fill: string): this;
    /**
     * Gets the fill opacity of this shape component.
     * @returns The fill opacity.
     */
    fillOpacity(): number;
    /**
     * Sets the fill opacity of this shape component. Defaults to `0`.
     * @param opacity - The fill opacity to apply.
     * @returns The current component instance for method chaining.
     */
    fillOpacity(opacity: number): this;
    /**
     * Gets the stroke color of this path component.
     * @returns The stroke color.
     */
    stroke(): string;
    /**
     * Sets the stroke color of this path component.
     * @param stroke - The stroke color to apply.
     * @returns The current component instance for method chaining.
     */
    stroke(stroke: string): this;
    /**
     * Gets the stroke opacity of this path component.
     * @returns The stroke opacity.
     */
    strokeOpacity(): number;
    /**
     * Sets the stroke opacity of this path component.
     * @param opacity - The stroke opacity to apply.
     * @returns The current component instance for method chaining.
     */
    strokeOpacity(opacity: number): this;
    /**
     * Gets the stroke width of this path component.
     * @returns The stroke width.
     */
    strokeWidth(): number;
    /**
     * Sets the stroke width of this path component.
     * @param width - The stroke width to apply.
     * @returns The current component instance for method chaining.
     */
    strokeWidth(width: number): this;
    /**
     * Gets the stroke dash offset of this path component.
     * @returns The stroke dash offset.
     */
    strokeDashOffset(): number;
    /**
     * Sets the stroke dash offset of this path component.
     * @param offset - The stroke dash offset to apply.
     * @returns The current component instance for method chaining.
     */
    strokeDashOffset(offset: number): this;
    /**
     * Gets the stroke dash array of this path component.
     */
    strokeDashArray(): Array<number>;
    /**
     * Sets teh stroke dash array of this path component. Defaults to `[1, 0]`.
     * @param array - The stroke dash array to apply.
     * @returns The current component instance for method chaining.
     */
    strokeDashArray(array: Array<number>): this;
    /**
     * Gets the color of this path component.
     * @returns The color.
     */
    color(): SDColor;
    /**
     * Sets the color of this path component.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    color(color: string | SDColor): this;
    markerStart(): string;
    markerStart(marker: string): this;
    markerMid(): string;
    markerMid(marker: string): this;
    markerEnd(): string;
    markerEnd(marker: string): this;
    /**
     * Sets an arrow to the start of this path component.
     * @param arrow
     * @returns The current component instance for method chaining.
     */
    revArrow(arrow?: true): this;
    /**
     * Removes the arrow at the start of this path component.
     * @param arrow
     * @returns The current component instance for method chaining.
     */
    revArrow(arrow: null | undefined | false): this;
    /**
     * Sets arrows to the start and the end of this path component.
     * @param arrow
     * @returns The current component instance for method chaining.
     */
    doubleArrow(arrow?: true): this;
    /**
     * Removes the arrows at the start and the end of this path component.
     * @param arrow
     * @returns The current component instance for method chaining.
     */
    doubleArrow(arrow: null | undefined | false): this;
    /**
     * Makes a path component gradually appear from the starting point to the ending point.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a line component appear with an arrow at the ending point.
     * line.startAnimate().pointStoT().endAnimate().arrow();
     */
    pointStoT(): this;
    /**
     * Makes a path component gradually appear from the ending point to the starting point.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a line component appear with an arrow at the starting point.
     * line.startAnimate().pointTtoS().endAnimate().revArrow();
     */
    pointTtoS(): this;
    /**
     * Makes a path component gradually fade from the starting point to the ending point.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a line component with an arrow at the ending point fade.
     * line.startAnimate().fadeStoT().endAnimate().arrow(null);
     */
    fadeStoT(): this;
    /**
     * Makes a path component gradually fade from the ending point to the starting point.
     *
     * This component must be animated currently.
     * @returns The current component instance for method chaining.
     * @example
     * // Makes a lien component with an arrow at the starting point fade.
     * line.startAnimate().fadeTtoS().endAnimate().revArrow(null);
     */
    fadeTtoS(): this;
    /**
     * Gets the coordinates of a point along this path component at a specified fractinal position.
     * - 0 corresponds to the starting point of the path.
     * - 1 corresponds to the ending point of the path.
     * @param k - A numeric value between 0 and 1 representing the fraction of the path length.
     * @returns The coordinates of the point.
     */
    at(k: number): [number, number];
    /**
     * Gets the coordinates of a point along this path component at a specified distance.
     * @param length - The cumulative distance from the start of the path component.
     * @returns The coordinates of the point.
     */
    getPointAtLength(length: number): [number, number];
    /**
     * Gets the total length of this path component.
     * @returns The total length.
     */
    totalLength(): number;
    /**
     * Casts the value component to its string representation.
     * - If the value component does not exist, returns an empty string ("").
     * - If the value component cannot be casted to a string, throws an Error.
     * @returns The string representation of the value component.
     */
    text(): string;
    /**
     * Sets the text content of the value component.
     * - If the value component does not exists, creates a new **`sd.Text`** instance to hold the text.
     * - If the value component value does not support text formatting, throws an Error.
     * @param text - The text content to apply.
     * @returns The current component instance for method chaining.
     */
    text(text: string): this;
    /**
     * Casts the value component to its integer representation.
     * - If the value component does not exists, returns zero.
     * - If the value component cannot be casted to an integer, throws an Error.
     * @returns The integer representation of the value component.
     */
    intValue(): number;
    /**
     * Gets the value component of this path component.
     * @returns The value component instance, or undefined if no value component has been set.
     */
    value(): any;
    /**
     * Sets the value component of this path component.
     * - Replaces any existing value component with the provided value.
     * - Removes the current value without replacement if provided value is null or undefined.
     * - Converts to **`sd.Text`** instance if provided value is number or string.
     * @param value - The provided value.
     * @param rule - Optional responsive rule.
     * @returns The current component instance for method chaining.
     */
    value(value: any, rule?: SDRule): this;
    /**
     * Sets the value component of this path component with an animated transition from its current position.
     *
     * Unlike standard value assignment, this method animates the movement of value component
     * from its original position to the new target position within the path component.
     * @param value - The provided value component.
     * @param rule - Optional responsive rule.
     * @returns The current component instance for method chaining.
     */
    valueFromExist(value: SDNode, rule?: SDRule): this;
    /**
     * Detachs the value component from this path component while preserving it in the scene.
     * - Removes association between the value component and this path component.
     * - Leaves the value component present in the scene.
     * - Returns the detached component for potential reuse.
     * @returns The detached value component instance, or undefined if no value component was present.
     */
    drop(): any;
}

export const BASE_PATH_ATTRIBUTES = {
    fill: C.white,
    fillOpacity: 0,
    stroke: C.black,
    strokeOpacity: 1,
    strokeWidth: 1,
    strokeDashOffset: 0,
    strokeDashArray: [1, 0],
    markerStart: "",
    markerMid: "",
    markerEnd: "",
};
