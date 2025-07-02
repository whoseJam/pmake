import { BaseGrid } from "@/Node/Grid/BaseGrid";

/**
 * Grid component implementing the value-as-element strategy.
 *
 * Render a grid where each value can be any component instance.
 */
export class ValueGrid extends BaseGrid {
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
     * @param axis - The axis orientation ot apply.
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
     * Gets the virtual element width of this grid component.
     * @returns The uniform width of all grid elements.
     */
    elementWidth(): number;
    /**
     * Sets the virtual element width of this grid component.
     *
     * Determines the width of bounding box for each element.
     * This affects spacing but not content rendering.
     * @param width - The virtual element width to apply.
     * @returns The current component instance for method chaining.
     */
    elementWidth(width: number): this;
    /**
     * Gets the virtual element height of this grid component.
     * @returns The uniform height of all grid elements.
     */
    elementHeight(): number;
    /**
     * Sets the virtual element height of this grid component.
     *
     * Determines the height of bounding box for each element.
     * This affects spacing but not content rendering.
     * @param height - The virtual element height to apply.
     * @returns The current component instance for method chaining.
     */
    elementHeight(height: number): this;
}
