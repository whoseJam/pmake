import { BaseGrid } from "@/Node/Grid/BaseGrid";

/**
 * Grid component implementing the value-inside-element strategy.
 *
 * Renders a uniform grid where each element is an **`sd.Box`** instance.
 */
export class Grid extends BaseGrid {
    /**
     * Gets the axis orientation of this grid component.
     * @returns The axis orientation.
     */
    axis(): "row" | "col";
    /**
     * Sets the axis orientation of this grid component.
     *
     * Determines the primary layout direction. Defaults to "row".
     * - "row": Elements are laid out horizontally first.
     * - "col": Elements are laid out vertically first.
     * @param axis - The axis orientation to apply.
     * @returns The current component instance for method chaining.
     */
    axis(axis: "row" | "col"): this;

    /**
     * Gets the alignment mode of this grid component.
     * @returns The alignment mode.
     */
    align(): "x" | "y" | "cx" | "cy" | "mx" | "my";
    /**
     * Sets the alignment mode of this grid component.
     *
     * Determines secondary dimension alignment based on the current layout direction. Defaults to "x".
     * - "x" | "y": Align left/top based on primary dimension.
     * - "cx" | "cy": Align center based on primary dimension.
     * - "mx" | "my": Align right/bottom based on primary dimension.
     * @param align - The alignment mode to apply.
     * @returns The current component instance for method chaining.
     */
    align(align: "x" | "y" | "cx" | "cy" | "mx" | "my"): this;
    /**
     * Gets the element width of this grid component.
     * @returns The uniform width of all grid elements.
     */
    elementWidth(): number;
    /**
     * Sets the element width of this grid component.
     * @param width - The uniform width of all grid elements.
     * @returns The current component instance for method chaining.
     */
    elementWidth(width: number): this;
    /**
     * Gets the element height of this grid component.
     * @returns The uniform height of all grid elements.
     */
    elementHeight(): number;
    /**
     * Sets the element height of this grid component.
     * @param width - The uniform height of all grid elements.
     * @returns The current component instance for method chaining.
     */
    elementHeight(height: number): this;
}
