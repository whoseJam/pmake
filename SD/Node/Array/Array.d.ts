import { SD2DNode } from "@/Nod/SD2DNode";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Box } from "@/Node/Element/Box";

/**
 * Array component implementing the value-inside-element strategy.
 *
 * Render a uniform array where each element is a **`sd.Box`** instance.
 */
export class Array<E = Box, V = SD2DNode> extends BaseArray<E, V> {
    /**
     * Gets the element width of this array component.
     * @returns The uniform width of all array elements.
     */
    elementWidth(): number;
    /**
     * Sets the element width of this array component.
     * @param width - The uniform width of all array elements.
     * @returns The current component instance for method chainning.
     */
    elementWidth(width: number): this;
    /**
     * Gets the element height of this array component.
     * @returns The uniform height of all array elements.
     */
    elementHeight(): number;
    /**
     * Sets the element height of this array component.
     * @param height - The uniform height of all array component.
     * @returns The current component instance for method chaining.
     */
    elementHeight(height: number): this;
}
