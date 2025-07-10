import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { SDColor } from "@/Utility/Color";

/**
 * BaseGrid is an abstract grid component that manages a 2-dimension array of components.
 * - The first dimension is called primary dimension.
 * - The second dimension is called secondary dimension.
 *
 * Rows and columns are not used to retrieve the elements because
 * the logical dimensions (primary dimension or secondary dimension) is separated from
 * the visual representation (rows or columns).
 *
 * The element components inside the grid component are automatically positioned
 * according to the specified layout configuration.
 */
export class BaseGrid extends SD2DNode {
    /**
     * Gets the starting index of this grid component's primary dimension.
     * @returns The index of the first element in the grid component's primary layout.
     */
    startN(): number;
    /**
     * Sets the starting index of this grid component's primary dimension. Default to `0`.
     * @param start - The start index value to apply.
     * @returns The current component instance for method chaining.
     * @example
     * // Creates a 5x5 grid component with indices starting from (1, 1).
     * grid.n(5).m(5).startN(1).startM(1);
     */
    startN(start: number): this;
    /**
     * Gets the starting index of this grid component's secondary dimension.
     * @returns The index of the first element in the grid component's secondary layout.
     */
    startM(): number;
    /**
     * Sets the starting index of this grid component's secondary dimension. Default to `0`.
     * @param start - The start index value to apply.
     * @returns The current component instance for method chaining.
     * @example
     * // Creates a 5x5 grid component with indices starting from (1, 1).
     * grid.n(5).m(5).startN(1).startM(1);
     */
    startM(start: number): this;
    /**
     * Gets the ending index of this grid component's primary dimension.
     * @returns The ending index in the grid component's primary layout.
     */
    endN(): number;
    /**
     * Gets the ending index of this grid component's secondary dimension.
     *
     * Returns the maximum last element index across all primary elements if their lengths vary.
     * @returns The ending index in the grid component's secondary layout.
     */
    endM(): number;
    /**
     * Gets the ending index of a specific primary element's secondary dimension.
     * @param i - The index of the specific primary element.
     * @returns The ending index in the specified primary element's secondary dimension.
     */
    endM(i: number): number;
    /**
     * Gets the number of primary elements in this grid component.
     * @returns The count of elements along the primary dimension.
     */
    n(): number;
    /**
     * Adjusts the number of primary elements in this grid component.
     * - If the target n is **greater** than the current n:
     *   Empty primary elements are appended to the end of the grid.
     * - If the target n is **less** than the current n:
     *   Primary elements are removed from the end of the grid.
     * @param n - The new number of primary elements to set.
     *            Must be a non-negative integer.
     * @returns The current component instance for method chaining.
     * @example
     * // Creates a 5x5 grid component.
     * grid.n(5).m(5);
     */
    n(n: number): this;
    /**
     * Gets the length of primary elements in this grid component.
     *
     * Returns the maximum length across all primary elements if their lengths vary.
     * @returns The count of secondary elements in the longest primary element.
     */
    m(): number;
    /**
     * Adjusts the length of all primary elements to the specified size.
     * - If the target m is **greater** than the current m:
     *   Appends elements to each primary element utill they match.
     * - If the target m is **less** than the current m:
     *   Truncates elements from each primary element utill they match.
     * @param m - The target m for this grid component.
     * @returns The current component instance for method chaining.
     * @example
     * // Creates a 5x5 grid component.
     * grid.n(5).m(5);
     */
    m(m: number): this;
    /**
     * Gets the element at the specified indices.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @returns The element at the specified position, or undefined if not found.
     * @example
     * // Gets the specified element at (3, 1).
     * const element = grid.element(3, 1);
     */
    element(i: number, j: number): any;
    /**
     * Iterates over each element in this grid component.
     * @param callback - A function to execute for each element.
     * @returns The current component instance for method chaining.
     */
    forEachElement(callback: (element: any, i: number, j: number) => void): this;

    /**
     * Gets the current opacity of this grid component.
     * @returns The opacity of the component.
     */
    opacity(): number;
    /**
     * Sets the opacity of this grid component. Defaults to `1`.
     * @param opacity - The opacity to apply.
     * @returns The current component instance for method chaining.
     */
    opacity(opacity: number): this;
    /**
     * Gets the opacity of a specific element.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @returns The opacity of the element.
     */
    opacity(i: number, j: number): number;
    /**
     * Sets the opacity of a specific element.
     * @param i - The index along the primary dimension;
     * @param j - The index along the secondary dimension.
     * @param opacity The opacity to apply.
     * @returns The current component instance for method chaining.
     *
     */
    opacity(i: number, j: number, opacity: number): this;
    /**
     * Applies a uniform color to all elements in this grid component.
     * @param color The color to apply.
     * @returns The current component instance for method chaining.
     */
    color(color: string | SDColor): this;
    /**
     * Gets the color of a specific element.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @returns The color of the element.
     */
    color(i: number, j: number): SDColor;
    /**
     * Sets the color of a specific element.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @param color The color to apply.
     * @returns The current component instance of method chaining.
     */
    color(i: number, j: number, color: string | SDColor): this;
    /**
     * Gets the text content of a specific element.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @returns The text content of the element.
     */
    text(i: number, j: number): string;
    /**
     * Sets the text content of a specific element.
     *
     * Throws an error if the element does not implement `text()`.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @param text The text content to set.
     * @returns The current component instance for method chaining.
     * @example
     * // Sets the text content of (1, 1) to "hello".
     * grid.startAnimate().text(1, 1, "hello").endAnimate();
     * // Sets the text content of (1, 2) to "123".
     * grid.startAnimate().text(1, 2, 123).endAnimate();
     */
    text(i: number, j: number, text: number | string): this;
    /**
     * Gets the value integer representation of a specific element.
     *
     * Throws an error if the element does not implement `intValue()`.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @returns The integer representation of the element.
     * @example
     * // Gets the integer representation of (1, 1) and (1, 2) and plus then together.
     * const sum = grid.intValue(1, 1) + grid.intValue(1, 2);
     */
    intValue(i: number, j: number): number;
    /**
     * Gets the value component of a specific element.
     *
     * Throws an error if the element does not implement `value()`,
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @returns The value component instance, or undefined if no value has been set.
     */
    value(i: number, j: number): any;
    /**
     * Sets the value component of a specific element.
     * - Replace any existing value component with the provided content.
     * - If `value` is null/undefined, removes the current value without replacement.
     * - Non-component value is automatically converted to **`sd.Text`** instance.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @param value The content to set as the value.
     * @returns The current component instance for method chaining.
     */
    value(i: number, j: number, value: any): this;
    /**
     * Inserts a value at a specific position.
     * - If the grid component is using strategy value-as-element, insert the value as-is.
     * - If the grid component is using strategy value-inside-element, wrap the value in an element first.
     * @param i - The target index for insertion along the primary dimension.
     * @param j - The target index for insertion along the secondary dimension.
     * @param value - The value to insert.
     * @returns The current component instance for method chaining.
     */
    insert(i: number, j: number, value?: any): this;
    insertFromExistValue(i: number, j: number, value: SDNode): this;
    insertFromExistElement(i: number, j: number, element: SDNode): this;
    pushSecondary(): this;
    pushSecondary(count: number): this;
    pushPrimary(): this;
    pushPrimary(count: number): this;

    erase(i: number, j: number): this;
    dropElement(i: number, j: number): any;
    dropValue(i: number, j: number): any;
    popSecondary(): this;
    popPrimary(): this;
}
