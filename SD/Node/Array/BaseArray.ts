import { Exit as EX } from "@/Node/Core/Exit";
import { SDNode, SDNodeWithColor, SDNodeWithDrop, SDNodeWithIntValue, SDNodeWithText, SDNodeWithValue } from "@/Node/SDNode";
import { Rect } from "@/Node/Shape/Rect";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { SDColor } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export class BaseArray<E, V> extends SDNode {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.newLayer("elements");

        this.vars.merge({
            start: 0,
            elements: [],
        });
    }
    x(): number;
    x(x: number): this;
    x() {
        return Rect.prototype.x.apply(this, arguments);
    }
    y(): number;
    y(y: number): this;
    y() {
        return Rect.prototype.y.apply(this, arguments);
    }
    /**
     * Gets the index of the first element in this array component.
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
    start(start?: number) {
        if (arguments.length === 0) return this.vars.start;
        Check.validateNumber(start, `${this.constructor.name}.start`);
        this.vars.lpset("start", start);
        return this;
    }
    /**
     * Gets the index of the last element in this array component.
     *
     * The end index is dynamically calculated based on the start index and
     * the number of elements in the array. It represents the highest valid
     * index within the current array structure.
     * @returns The index of the last element, or `this.start() - 1` if the array is empty.
     */
    end() {
        return this.start() + this.length() - 1;
    }
    /**
     * Gets the number of elements in this array component.
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
    length(length?: number) {
        if (arguments.length === 0) {
            const elements = this.vars.elements;
            return elements.length;
        }
        let currentLength = this.length();
        Check.validateNumber(length, `${this.constructor.name}.length`);
        while (currentLength < length) this.push(), currentLength++;
        while (currentLength > length) this.pop(), currentLength--;
        return this;
    }
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
    resize(length: number) {
        return this.length(length);
    }
    /**
     * Gets the index of a specific element within this array component.
     * @param element - The target element to locate.
     * @returns The index of the specific element, or -1 if not found.
     */
    indexOf(element: E) {
        for (let i = this.start(); i <= this.end(); i++) if (this.element(i) === element) return i;
        return -1;
    }
    /**
     * Gets the element at the specified index.
     * @param i - The index of the specific element.
     * @returns The element at the specified index, or undefined if not found.
     */
    element(i: number): E {
        const id = this.__idx(i);
        if (0 <= id && id < this.length()) return this.vars.elements[id];
        return undefined;
    }
    /**
     * Gets all elements contained within this array component.
     * @returns An array containing all valid elements in this component.
     */
    elements(): Array<E> {
        return [...this.vars.elements];
    }
    /**
     * Gets the first element in this array component.
     * @returns The first element, or undefined if the array is empty.
     */
    firstElement(): E {
        return this.element(this.start());
    }
    /**
     * Gets the last element in this array component.
     * @returns The last element, or undefined if the array is empty.
     */
    lastElement(): E {
        return this.element(this.end());
    }
    /**
     * Iterates over each element in this array component.
     * @param callback - A function to execute for each element.
     * @returns The current component instance for method chaining.
     */
    forEachElement(callback: (element: E, i: number) => void) {
        Check.validateSyncFunction(callback, `${this.constructor.name}.forEachElement`);
        this.vars.elements.forEach((element: E, i: number) => callback(element, i + this.start()));
        return this;
    }
    opacity(): number;
    opacity(opacity: number): this;
    /**
     * Sets the opacity of a specific element.
     * @param i - The index of the specific element.
     * @param opacity The opacity to apply
     * @returns The current component instance for method chaining.
     */
    opacity(i: number, opacity: number): this;
    opacity() {
        if (arguments.length === 0) {
            return super.opacity();
        } else if (arguments.length === 1) {
            const [opacity] = arguments;
            return super.opacity(opacity);
        } else {
            const [id, opacity] = arguments;
            const element = this.__getElementWithMethod(id, "opacity") as SDNode;
            element.opacity(opacity);
            return this;
        }
    }
    /**
     * Applies a uniform color to all elements in this array component.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    color(color: string | SDColor): this;
    /**
     * Gets the color of a specific element.
     * @param i - The index of the specific element.
     * @returns The color of the element.
     */
    color(i: number): SDColor;
    /**
     * Sets the color of a specific element.
     * @param i - The index of the specific element.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    color(i: number, color: string | SDColor): this;
    /**
     * Sets the color of elements within the specified range [l, r].
     * @param l - The start index of the range (inclusive).
     * @param r - The end index of the range (inclusive).
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    color(l: number, r: number, color: string | SDColor): this;
    color() {
        if (arguments.length === 1) {
            if (Check.isColor(arguments[0])) {
                const [color] = arguments;
                return this.forEachElement(element => (element as SDNodeWithColor).color(color));
            } else {
                const [id] = arguments;
                const element = this.__getElementWithMethod(id, "color") as SDNodeWithColor;
                return element.color();
            }
        } else if (arguments.length === 2) {
            const [id, color] = arguments;
            const element = this.__getElementWithMethod(id, "color") as SDNodeWithColor;
            element.color(color);
            return this;
        } else {
            const [l, r, color] = arguments;
            for (let i = l; i <= r; i++) this.color(i, color);
            return this;
        }
    }
    /**
     * Gets the text content of a specific element.
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
    text(i: number, text: string | number): this;
    text(i: number, text?: string | number) {
        const element = this.element(i) as SDNodeWithText;
        if (!element) ErrorLauncher.arrayElementNotFound(i);
        if (!element.text) ErrorLauncher.methodNotFound(element, "text");
        if (arguments.length === 1) return element.text();
        element.text(text);
        return this;
    }
    /**
     * Gets the integer representation of a specific element.
     *
     * Throws an error if the element does not implement `intValue()`.
     * @param i - The index of the specific element.
     * @returns The integer representation of the element.
     */
    intValue(i: number): number {
        const element = this.element(i) as SDNodeWithIntValue & SDNodeWithText;
        if (!element) ErrorLauncher.arrayElementNotFound(i);
        if (!element.intValue) {
            if (!element.text) ErrorLauncher.methodNotFound(element, "intValue|text");
            const i = Math.floor(+element.text());
            if (isNaN(i)) ErrorLauncher.failToParseAsIntValue(element.text());
            return i;
        }
        return element.intValue();
    }
    /**
     * Gets the value component of a specific element.
     *
     * Throws an error if the element does not implement `value()`.
     * @param i - The index of the specific element.
     * @returns The value component instance, or undefined if no value has been set.
     */
    value(i: number): V;
    /**
     * Sets the value component of a specific element.
     * - Replace any existing value component with the provided content.
     * - If `value` is null/undefined, removes the current value without replacement.
     * - Non-component value is automatically converted to **`sd.Text`** instance.
     * @param i - The index of the specific element.
     * @param value - The content to set as the value.
     * @returns The current component instance for method chaining.
     */
    value(i: number, value: any): this;
    value(i: number, value?: any) {
        Check.validateNumber(i, `${this.constructor.name}.value`);
        const element = this.__getElementWithMethod(i, "value") as SDNodeWithValue;
        if (arguments.length === 1) return element.value();
        element.value(value);
        return this;
    }

    /**
     * Inserts a value at a specified position.
     *
     * Handles both direct value insertion and element wrapping:
     * - If the array is using strategy value-as-element, inserts the value as-is.
     * - If the array is using strategy value-inside-element, wraps the value in an element first.
     * @param i - The target index for insertion.
     * @param value - The value to insert.
     * @returns The current component instance for method chaining.
     */
    insert(i: number, value: any) {
        ErrorLauncher.notImplementedYet(`${this.constructor.name}.insert`);
        return this;
    }
    insertFromExistValue(i: number, value: V) {
        ErrorLauncher.notImplementedYet(`${this.constructor.name}.insertFromExistValue`);
        return this;
    }
    insertFromExistElement(i: number, element: E) {
        ErrorLauncher.notImplementedYet(`${this.constructor.name}.insertFromExistElement`);
        return this;
    }
    /**
     * Appends a value to the end of this array component.
     * @param value - The value to append.
     * @returns The current component instance for method chaining.
     */
    push(value?: any): this {
        this.insert(this.end() + 1, value);
        return this;
    }
    pushFromExistValue(value: V): this {
        this.insertFromExistValue(this.end() + 1, value);
        return this;
    }
    pushFromExistElement(element: E): this {
        this.insertFromExistElement(this.end() + 1, element);
        return this;
    }
    /**
     * Appends all elements from an array to the end of this array component.
     * @param array - The array of elements to append.
     * @returns The current component instance for method chaining.
     */
    pushArray(array: Array<any> | string): this {
        for (let i = 0; i < array.length; i++) this.push(array[i]);
        return this;
    }

    erase(i: number): this {
        const element = this.element(i) as SDNode;
        if (!element) ErrorLauncher.arrayElementNotFound(i);
        element.onExitDefault(EX.fade());
        this.__erase(i);
        return this;
    }
    pop(): this {
        return this.erase(this.end());
    }
    dropElement(i: number): E {
        const element = this.element(i) as E & SDNode;
        if (!element) return undefined;
        element.onExit(EX.drop());
        this.__erase(i);
        return element;
    }
    dropFirstElement(): E {
        return this.dropElement(this.start());
    }
    dropLastElement(): E {
        return this.dropElement(this.end());
    }
    dropValue(i: number): V {
        const element = this.element(i) as SDNodeWithDrop;
        if (!element) return undefined;
        if (!element.drop) ErrorLauncher.methodNotFound(element, "drop");
        return element.drop();
    }
    dropFirstValue(): V {
        return this.dropValue(this.start());
    }
    dropLastValue(): V {
        return this.dropValue(this.end());
    }
    sort(comparator?: (a: E, b: E) => number): this;
    sort(l: number, r: number, comparator?: (a: E, b: E) => number): this;
    sort(l: number | ((a: E, b: E) => number), r?: number, comparator = (a, b) => a.intValue() - b.intValue()) {
        if (arguments.length === 0) return this.sort(this.start(), this.end(), comparator);
        if (arguments.length === 1) return this.sort(this.start(), this.end(), arguments[0]);
        const l_ = this.__idx(+l);
        const r_ = this.__idx(+r);
        const elements = this.vars.elements;
        const subarray = elements.slice(l_, r_ + 1);
        subarray.sort(comparator);
        elements.splice(l_, subarray.length, ...subarray);
        this.vars.elements = elements;
        return this;
    }

    __idx(i: number) {
        return i - this.start();
    }
    __insert(i: number, element: E) {
        this.childAs(element as SDNode);
        const idx = this.__idx(i);
        if (idx < 0 || idx > this.length()) ErrorLauncher.outOfRangeError(i);
        this.vars.elements.splice(idx, 0, element);
        return this;
    }
    __erase(i: number) {
        const element = this.element(i);
        const elements = this.vars.elements;
        elements.splice(this.__idx(i), 1);
        this.eraseChild(element as SDNode);
        return this;
    }
    __getElementWithMethod(i: number, method: string) {
        const element = this.element(i);
        if (!element) ErrorLauncher.arrayElementNotFound(i);
        if (typeof element[method] !== "function") ErrorLauncher.methodNotFound(element, method);
        return element;
    }
}
