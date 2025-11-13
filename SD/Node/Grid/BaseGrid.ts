import { Exit as EX } from "@/Node/Core/Exit";
import {
    SDNode,
    SDNodeWithColor,
    SDNodeWithDrop,
    SDNodeWithIntValue,
    SDNodeWithText,
    SDNodeWithValue,
} from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { SDAllColor, SDPacketColor } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

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
export abstract class BaseGrid<E = SDNode, V = SDNode> extends SDNode {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.newLayer("elements");

        this.vars.merge({
            n: 0,
            m: 0,
            x: 0,
            y: 0,
            startN: 0,
            startM: 0,
            elements: [],
        });
    }

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
    startN(n: number): this;
    startN(n?: number) {
        if (arguments.length === 0) return this.vars.startN;
        this.vars.startN = n;
        return this;
    }

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
    startM(m: number): this;
    startM(m?: number) {
        if (arguments.length === 0) return this.vars.startM;
        this.vars.startM = m;
        return this;
    }

    /**
     * Gets the ending index of this grid component's primary dimension.
     * @returns The ending index in the grid component's primary layout.
     */
    endN(): number {
        return this.startN() + this.n() - 1;
    }

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
    endM(i?: number) {
        if (arguments.length === 0) return this.startM() + this.m() - 1;
        const _i = this.__idxN(i);
        if (_i >= this.vars.elements.length || _i < 0) return this.startM() - 1;
        return this.startM() + this.vars.elements[this.__idxN(i)].length - 1;
    }

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
    n(n?: number) {
        if (arguments.length === 0) return this.vars.n;
        while (this.n() < n) this.pushPrimary();
        while (this.n() > n) this.popPrimary();
        return this;
    }

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
    m(m?: number) {
        if (arguments.length === 0) return this.vars.m;
        while (this.m() < m) this.pushSecondary();
        while (this.m() > m) this.popSecondary();
        return this;
    }

    /**
     * Gets the element at the specified indices.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @returns The element at the specified position, or undefined if not found.
     * @example
     * // Gets the specified element at (3, 1).
     * const element = grid.element(3, 1);
     */
    element(i: number, j: number): E {
        const [_i, _j] = [this.__idxN(i), this.__idxM(j)];
        if (0 <= _i && _i < this.vars.elements.length && 0 <= _j && _j < this.vars.elements[_i].length)
            return this.vars.elements[_i][_j];
        return undefined;
    }

    /**
     * Iterates over each element in this grid component.
     * @param callback - A function to execute for each element.
     * @returns The current component instance for method chaining.
     */
    forEachElement(callback: (element: E, i: number, j: number) => void) {
        Check.validateSyncFunction(callback, `${this.type()}.forEachElement`);
        this.vars.elements.forEach((row: Array<E>, i: number) => {
            row.forEach((element, j) => {
                callback(element, i + this.startN(), j + this.startM());
            });
        });
        return this;
    }

    opacity(): number;
    opacity(opacity: number): this;
    opacity(i: number, j: number): number;
    opacity(i: number, j: number, opacity: number): this;
    opacity() {
        if (arguments.length === 0) {
            return SDNode.prototype.opacity.call(this);
        } else if (arguments.length === 1) {
            const [opacity] = arguments;
            return SDNode.prototype.opacity.call(this, opacity);
        } else if (arguments.length === 2) {
            const [i, j] = arguments;
            const element = this.__getElementWithMethod(i, j, "opacity") as SDNode;
            return element.opacity();
        } else {
            const [i, j, opacity] = arguments;
            const element = this.__getElementWithMethod(i, j, "opacity") as SDNode;
            element.opacity(opacity);
            return this;
        }
    }

    /**
     * Applies a uniform color to all elements in this grid component.
     * @param color The color to apply (hex string or RGB object).
     * @returns The current component instance for method chaining.
     */
    color(color: SDAllColor): this;
    /**
     * Gets the color of a specific element.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @returns The color of the element.
     */
    color(i: number, j: number): SDPacketColor;
    /**
     * Sets the color of a specific element.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @param color The color to apply (hex string or RGB object).
     * @returns The current component instance of method chaining.
     */
    color(i: number, j: number, color: SDAllColor): this;
    color() {
        if (arguments.length === 1) {
            const [color] = arguments;
            return this.forEachElement(element => (element as SDNodeWithColor).color(color));
        } else if (arguments.length === 2) {
            const [i, j] = arguments;
            const element = this.__getElementWithMethod(i, j, "color") as SDNodeWithColor;
            return element.color();
        } else {
            const [i, j, color] = arguments;
            const element = this.__getElementWithMethod(i, j, "color") as SDNodeWithColor;
            element.color(color);
            return this;
        }
    }

    /**
     * Gets the text content of a specific element.
     *
     * Throws an error if the element does not implement `text()`.
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
    text(i: number, j: number, text?: number | string) {
        const element = this.element(i, j) as SDNodeWithText;
        if (!element) ErrorLauncher.gridElementNotFound(i, j);
        if (!element.text) ErrorLauncher.methodNotFound(element, "text");
        if (arguments.length === 2) return element.text();
        element.text(text);
        return this;
    }
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
    intValue(i, j) {
        const element = this.element(i, j) as SDNodeWithIntValue & SDNodeWithText;
        if (!element) return ErrorLauncher.gridElementNotFound(i, j);
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
    value(i: number, j: number, value?: any) {
        Check.validateNumber(i, `${this.constructor.name}.value`, 1);
        Check.validateNumber(j, `${this.constructor.name}.value`, 2);
        const element = this.__getElementWithMethod(i, j, "value") as SDNodeWithValue;
        if (arguments.length === 2) return element.value();
        element.value(value);
        return this;
    }
    abstract insert(i: number, j: number, element: E): this;
    abstract insertFromExistValue(i: number, j: number, value: V): this;
    abstract insertFromExistElement(i: number, j: number, element: E): this;
    pushSecondary(count?: number) {
        const l = this.startN();
        const r = count === undefined ? this.endN() : l + count - 1;
        for (let i = l; i <= r; i++) this.insert(i, this.endM(i) + 1, null);
        if (l > r) this.vars.m++;
        return this;
    }
    pushPrimary(count?: number) {
        let n = this.endN() + 1;
        let l = this.startM();
        let r = count === undefined ? this.endM() : l + count - 1;
        for (let j = l; j <= r; j++) this.insert(n, j, null);
        if (l > r) {
            this.vars.n++;
            this.vars.elements.push([]);
        }
        return this;
    }
    erase(i: number, j: number) {
        const element = this.element(i, j) as SDNode;
        if (!element) ErrorLauncher.gridElementNotFound(i, j);
        element.onExitDefault(EX.fade());
        this.__erase(i, j);
        return this;
    }
    dropElement(i: number, j: number): E {
        const element = this.element(i, j) as SDNode;
        if (!element) return undefined;
        element.onExit(EX.drop());
        this.__erase(i, j);
        return element as E;
    }
    dropValue(i: number, j: number): V {
        const element = this.element(i, j) as SDNodeWithDrop;
        if (!element) return undefined;
        if (!element.drop) ErrorLauncher.methodNotFound(element, "drop");
        return element.drop();
    }
    popSecondary() {
        let erased = false;
        const elements = this.vars.elements;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i].pop();
            if (element) {
                this.eraseChild(element);
                erased = true;
            }
        }
        if (erased) this.vars.m--;
        return this;
    }
    popPrimary() {
        const row = this.vars.elements.pop();
        if (!row) return this;
        row.forEach(element => this.eraseChild(element));
        this.vars.n--;
        return this;
    }
    __idxN(i: number) {
        return i - this.startN();
    }
    __idxM(j: number) {
        return j - this.startM();
    }
    __insert(i: number, j: number, element: E) {
        const ri = this.__idxN(i);
        const rj = this.__idxM(j);
        if (ri < 0) ErrorLauncher.outOfRangeError(i, j);
        this.childAs(element as SDNode);
        const elements = this.vars.elements;
        while (elements.length <= ri) elements.push([]);
        if (rj < 0 || rj > elements[ri].length) ErrorLauncher.outOfRangeError(i, j);
        elements[ri].splice(rj, 0, element);
        this.vars.n = elements.length;
        this.vars.m = Math.max(elements[ri].length, this.vars.m);
        return this;
    }
    __erase(i: number, j: number) {
        const element = this.element(i, j) as SDNode;
        const ri = this.__idxN(i);
        const rj = this.__idxM(j);
        const elements = this.vars.elements;
        elements[ri].splice(rj, 1);
        this.eraseChild(element);
        let m = 0;
        for (let i = 0; i < elements.length; i++) m = Math.max(m, elements[i].length);
        this.vars.n = elements.length;
        this.vars.m = m;
        return this;
    }
    __getElementWithMethod(i, j, method) {
        const element = this.element(i, j);
        if (!element) ErrorLauncher.gridElementNotFound(i, j);
        if (typeof element[method] !== "function") ErrorLauncher.methodNotFound(element, method);
        return element;
    }
}
