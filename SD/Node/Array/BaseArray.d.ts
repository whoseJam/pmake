import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { PacketColor, SDColor } from "@/Utility/Color";

export class BaseArray extends SD2DNode {
    /**
     * Retrieves the index of the first element in this array component.
     * @returns The index of the first element.
     */
    start(): number;
    /**
     * Sets the index of the first element in this array component.
     *
     * The index of the first element is 0 by default, affecting how
     * elements are indexed.
     * @param start - The new start index value to apply.
     * @returns The current component instance for method chaining.
     */
    start(start: number): this;
    /**
     * Retrieves the index of the last element in this array component.
     *
     * The end index is dynamically calculated based on the start index and
     * the number of elements in the array. It represents the highest valid
     * index within the current array structure.
     * @returns The index of the last element, or `this.start() - 1` if the array is empty.
     */
    end(): number;

    /**
     * Retrieves the number of elements in this array component.
     * @returns The number of elements in the array.
     */
    length(): number;
    /**
     * Adjusts the number of elements in this array component.
     * - If the target length is **greater** than the current size:
     *   Empty elements are appended to the end of the array.
     * - If the target length is **less** than the current size:
     *   Elements are removed from the end of the array.
     * @param length - The new number of elements to set.
     *                 Must be a non-negative integer.
     * @returns The current component instance for method chaining.
     */
    length(length: number): this;
    /**
     * Adjusts the number of elements in this array component.
     * - If the target length is **greater** than the current size:
     *   Empty elements are appended to the end of the array.
     * - If the target length is **less** than the current size:
     *   Elements are removed from the end of the array.
     * @param length - The new number of elements to set.
     *                 Must be a non-negative integer.
     * @returns The current component instance for method chaining.
     */
    resize(length: number): this;
    /**
     * Retrieves the index of a specific element within this array component.
     * @param element - The SDNode instance to locate.
     * @returns The index of the specific element, or -1 if not found.
     */
    indexOf(element: SDNode): number;
    /**
     * Retrieves the element at the specified index.
     * @param i - The index of the specific element.
     * @returns The element at the specified index, or undefined if not found.
     */
    element(i: number): SDNode | undefined;
    /**
     * Retrieves all elements contained within this array component.
     *
     * Note that the array's child count may exceed the number of elements if it contains
     * non-element components (e.g., labels, pointers, indexes).
     * @returns An array containing all valid SDNode elements in this component.
     */
    elements(): Array<SDNode>;
    /**
     * Retrieves the last element in this array component.
     * @returns The last element, or undefined if the array is empty.
     */
    lastElement(): SDNode | undefined;
    /**
     * Retrieves the first element in this array component.
     * @returns The first element, or undefined if the array is empty.
     */
    firstElement(): SDNode | undefined;
    /**
     * Iterates over each element in this array component.
     * @param callback - A function to execute for each element.
     * @returns The current component instance for method chaining.
     */
    forEachElement(callback: (element: SDNode, id: number) => void): this;

    /**
     * Retrieves the opacity of a specific element.
     * @param i - The index of the specific element.
     * @returns The opacity of the element.
     */
    opacity(i: number): number;
    /**
     * Sets the opacity of a specific element.
     * @param i - The index of the specific element.
     * @param opacity The opacity to apply
     * @returns The current component instance for method chaining.
     */
    opacity(i: number, opacity: number): this;
    /**
     * Applies a uniform color to all elements in this array component.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    color(color: SDColor): this;
    /**
     * Retrieves the color of a specific element.
     * @param i - The index of the specific element.
     * @returns The color of the element.
     */
    color(i: number): PacketColor;
    /**
     * Sets the color of a specific element.
     * @param i - The index of the specific element.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    color(i: number, color: SDColor): this;
    /**
     * Sets the color of elements within the specified range [l, r].
     * @param l - The start index of the range (inclusive).
     * @param r - The end index of the range (inclusive).
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    color(l: number, r: number, color: SDColor): this;
    /**
     * Retrieves the text content of a specific element.
     *
     * Throws an error if the element does not implement `text()`.
     * @param i - The index of the specific element.
     * @returns The text content of the element.
     */
    text(i: number): string;
    /**
     * Sets the text content of a specific element.
     *
     * Throws an error if the element does not implement `text()`.
     * @param i - The index of the specific element.
     * @param text - The text content to set.
     * @returns The current component instance for method chaining.
     */
    text(i: number, text: number | string): this;
    /**
     * Retrieves the integer representation of a specific element.
     *
     * Throws an error if the element does not implement `intValue()`.
     * @param i - The index of the specific element.
     * @returns The integer representation of the value.
     */
    intValue(i: number): number;
    /**
     * Retrieves the value component inside a specific element.
     *
     * Throws an error if the element does not implement `value()`.
     * @param i - The index of the specific element.
     * @returns The value component instance, or undefined if no value has been set.
     */
    value(i: number): SDNode | undefined;
    /**
     * Sets the value component inside a specific element.
     * - Replace any existing value component with the provided content.
     * - If `value` is null/undefined, removes the current value without replacement.
     * - Non-SDNode value is automatically converted to **`sd.Text`** instance.
     * @param i - The index of the specific element.
     * @param value - The content to set as the value.
     * @returns The current component instance for method chaining.
     */
    value(i: number, value: SDNode): this;

    /**
     * Inserts a value at the specified position.
     * Handles both direct value insertion and element wrapping:
     * - If the array is using strategy value-as-element, inserts the value as-is.
     * - If the array is using strategy value-inside-element, wraps the value in an element first.
     * @param i - The target index for insertion.
     * @param value - The value to insert.
     * @returns The current component instance for method chaining.
     */
    insert(i: number, value: any): this;
    insertFromExistValue(i: number, value: SDNode): this;
    insertFromExistElement(i: number, element: SDNode): this;
    /**
     * Appends a value to the end of this array component.
     * @param value - The value to append.
     * @returns The current component instance for method chaining.
     */
    push(value: any): this;
    pushFromExistValue(value: SDNode): this;
    pushFromExistElement(element: SDNode): this;
    /**
     * Appends all elements from an array to the end of this array component.
     * @param array - The array of elements to append.
     * @returns The current component instance for method chaining.
     */
    pushArray(array: Array<any>): this;

    erase(i: number): this;
    pop(): this;
    dropElement(i: number): SDNode | undefined;
    dropFirstElement(): SDNode | undefined;
    dropLastElement(): SDNode | undefined;
    dropValue(i: number): SDNode | undefined;
    dropFirstValue(): SDNode | undefined;
    dropLastValue(): SDNode | undefined;

    sort(comparator?: (a: SDNode, b: SDNode) => number): this;
    sort(l: number, r: number, comparator?: (a: SDNode, b: SDNode) => number): this;
}
