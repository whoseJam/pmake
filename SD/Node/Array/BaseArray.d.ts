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
     * @returns The current instance for method chaining.
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
     * @returns The current instance for method chaining.
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
     * @returns The current instance for method chaining.
     */
    resize(length: number): this;
    /**
     * Retrieves the index of a specific element within this array component.
     * @param element - The SDNode instance to locate.
     * @returns The index of the element, or -1 if not found.
     */
    indexOf(element: SDNode): number;
    /**
     * Retrieves the element at the specified index.
     *
     * Returns the SDNode instance at the given index, or undefined if
     * the index is out of the valid range.
     * @param i - The index of the element to retrieve.
     * @returns The element at the specified index, or undefined if not found.
     */
    element(i: number): SDNode | undefined;
    /**
     *
     */
    elements(): Array<SDNode>;
    lastElement(): SDNode | undefined;
    firstElement(): SDNode | undefined;
    forEachElement(callback: (element: SDNode, id: number) => void): this;

    opacity(id: number): number;
    opacity(id: number, opacity: number): this;
    color(color: SDColor): this;
    color(id: number): PacketColor;
    color(id: number, color: SDColor): this;
    color(l: number, r: number, color: SDColor): this;
    text(id: number): string;
    text(id: number, text: string): this;
    intValue(id: number): number;
    value(id: number): SDNode;
    value(id: number, value: SDNode): this;

    insert(id: number, value: any): this;
    insertFromExistValue(id: number, value: SDNode): this;
    insertFromExistElement(id: number, element: SDNode): this;
    push(value: any): this;
    pushFromExistValue(value: SDNode): this;
    pushFromExistElement(element: SDNode): this;
    pushArray(array: Array<any>): this;

    erase(id: number): this;
    pop(): this;
    dropElement(id: number): SDNode | undefined;
    dropFirstElement(): SDNode | undefined;
    dropLastElement(): SDNode | undefined;
    dropValue(id: number): SDNode | undefined;
    dropFirstValue(): SDNode | undefined;
    dropLastValue(): SDNode | undefined;

    sort(comparator?: (a: SDNode, b: SDNode) => number): this;
    sort(l: number, r: number, comparator?: (a: SDNode, b: SDNode) => number): this;
}
