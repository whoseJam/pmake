import { SDNode } from "@/Node/SDNode";
import { Rect } from "@/Node/Shape/Rect";
import { RenderNode } from "@/Renderer/RenderNode";

class FocusPlugin extends Rect {
    /**
     * Sets focus on the initialization target component.
     * @returns The current component instance for method chaining.
     */
    focus(): this;
    /**
     * Sets focus on a specific element within the initialization target component.
     * - Throws an error if the initialization target component is not an instance of `sd.BaseArray`, `sd.BaseTree` or `sd.BaseGraph`.
     * @param i - The index of the specific element.
     * @returns The current component instance for method chaining.
     */
    focus(i: number): this;
    /**
     * Sets focus on a range of elements within the initialization target component.
     * - Throws an error if the initialization target component is not an instance of `sd.BaseArray`.
     * @param l - The left index of the range.
     * @param r - The right index of the range.
     * @returns The current component instance for method chaining.
     */
    focus(l: number, r: number): this;
    /**
     * Sets focus on a specific element within the initialization target component.
     * - Throws an error if the initialization target component is not an instance of `sd.BaseGrid`.
     * @param i - The index along the primary dimension.
     * @param j - The index along the secondary dimension.
     * @returns The current component instance for method chaining.
     */
    focus(i: number, j: number): this;
    /**
     * Sets focus on a region of elements within the initialization target component.
     * - Throws an error if the initialization target component is not an instance of `sd.BaseGrid`.
     * @param i1
     * @param j1
     * @param i2
     * @param j2
     * @returns The current component instance for method chaining.
     */
    focus(i1: number, j1: number, i2: number, j2: number): this;
    /**
     * Sets focus on the target component.
     * @param target
     * @returns The current component instance for method chaining.
     */
    focus(target: SDNode): this;
    /**
     * Sets focus on a region defined by two target components.
     * @param target1 - The first component defining the focus region.
     * @param target2 - The second component defining the focus region.
     * @returns The current component instance for method chaining.
     */
    focus(target1: SDNode, target2: SDNode): this;
    /**
     * Removes the current focus region.
     * @param cancel
     * @returns The current component instance for method chaining.
     */
    focus(cancel: null | undefined | false): this;
    /**
     * Gets the gap between the focus component and its target components.
     * @returns The gap.
     */
    gap(): number;
    /**
     * Sets the gap between the focus component and its target components. Defaults to `0`.
     * @param gap - The gap to apply.
     * @returns The current component instance for method chaining.
     */
    gap(gap: number): this;
}

/**
 * Creates a **`sd.FocusPlugin`** instance to highlight a region.
 * @param target
 * @returns A new plugin instance.
 */
export function Focus(target: SDNode | RenderNode): FocusPlugin;
