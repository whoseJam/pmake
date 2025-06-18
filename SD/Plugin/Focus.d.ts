import { SD2DNode } from "@/Node/SD2DNode";
import { Rect } from "@/Node/Shape/Rect";
import { RenderNode } from "@/Renderer/RenderNode";

export class FocusPlugin extends Rect {
    /**
     * Sets focus on the target component.
     * @returns The current plugin instance for method chaining.
     */
    focus(): this;
    /**
     * Sets focus on a specific element within the target array component.
     *
     * Throws an error if the target component is not an instance of `sd.BaseArray`.
     * @param i - The index of the specific element.
     * @returns The current plugin instance for method chaining.
     */
    focus(i: number): this;
    /**
     * Sets focus on a range of elements within the target array component.
     *
     * Throws an error if the target component is not an instance of `sd.BaseArray`.
     * @param l - The left index of the range.
     * @param r - The right index of the range.
     * @returns The current plugin instance for method chaining.
     */
    focus(l: number, r: number): this;
    /**
     * Sets focus on a specific element within the target grid component.
     *
     * Throws an error if the target component is not an instance of `sd.BaseGrid`.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @returns The current plugin instance for method chaining.
     */
    focus(i: number, j: number): this;
    /**
     * Sets focus on a region within the target grid component.
     *
     * Throws an error if the target component is not an instance of `sd.BaseGrid`.
     * @param i1
     * @param j1
     * @param i2
     * @param j2
     * @returns The current plugin instance for method chaining.
     */
    focus(i1: number, j1: number, i2: number, j2: number): this;
    /**
     * Sets focus on the target element.
     * @param target
     * @returns The current plugin instance for method chaining.
     */
    focus(target: SD2DNode): this;
    /**
     * Sets focus on a region defined by two target components.
     * @param target1 - The first component defining the focus region.
     * @param target2 - The second component defining the focus region.
     * @returns The current plugin instance for method chaining.
     */
    focus(target1: SD2DNode, target2: SD2DNode): this;
    /**
     * Clears the current focus plugin.
     * @param cancel
     * @returns The current plugin instance for method chaining.
     */
    focus(cancel: null | undefined | false): this;
    /**
     * Retrieves the padding rate for the focused region.
     * @returns The padding rate.
     */
    rate(): number;
    /**
     * Sets the padding rate for the focused region.
     *
     * The padding rate determines the amount of padding around focused region.
     * A higher rate increases the space between the target element and the border of focus plugin.
     * Default value is 1.
     * @param rate The padding rate to apply.
     * @returns The current plugin instance for method chaining.
     */
    rate(rate: number): this;
    /**
     * Retrieves the padding length for the focused region.
     * @returns The padding length.
     */
    gap(): number;
    /**
     * Sets the padding length for the focused region.
     *
     * The padding length determines the amount of padding around focused region.
     * A higher length increases the space between the target element and the border of focus plugin.
     * Default value is 0.
     * @param gap The padding length to apply.
     * @returns The current plugin instance for method chaining.
     */
    gap(gap: number): this;
}

/**
 * Creates a **`sd.FocusPlugin`** instance to highlight a region.
 * @param target - The destination to render the plugin.
 * @returns A new plugin instance.
 */
export function Focus(target: SD2DNode | RenderNode): FocusPlugin;
