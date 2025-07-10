import { BaseGrid } from "@/Node/Grid/BaseGrid";

/**
 * Grid component implementing the value-as-element strategy.
 *
 * Renders a grid where each cell can contain an arbitrary component instance.
 * This provides maximum flexibility for composing grid structures, as each element
 * can differ in type and appearance.
 *
 * @example
 * const n = 3;
 * const m = 5;
 * const grid = new sd.Grid(svg).startN(1).startM(1);
 * grid.insert(1, 1, new sd.Text(grid, "hello"));
 * grid.insert(1, 2, new sd.Circle(grid));
 * grid.insert(1, 3, new sd.Button(grid));
 */
export class ValueGrid extends BaseGrid {
    /**
     * Gets the axis orientation of this grid component.
     * @returns The axis orientation.
     */
    axis(): string;
    /**
     * Sets the axis orientation of this grid component. Defaults to "row".
     *
     * Determines the primary layout direction.
     * - "row": Elements are laid out horizontally first.
     * - "col": Elements are laid out vertically first.
     * @param axis - The axis orientation ot apply.
     * @returns The current component instance for method chaining.
     */
    axis(axis: string): this;

    /**
     * Gets the alignment mode of this grid component.
     * @returns The alignment mode.
     */
    align(): string;
    /**
     * Sets the alignment mode of this grid component. Defaults to "x".
     *
     * Determines secondary dimension alignment based on the current layout direction.
     * - "x" | "y": Align left/top based on primary dimension.
     * - "cx" | "cy": Align center based on primary dimension.
     * - "mx" | "my": Align right/bottom based on primary dimension.
     * @param align - The alignment mode to apply.
     * @returns The current component instance for method chaining.
     */
    align(align: string): this;
    /**
     * Gets the virtual element width of this grid component.
     * @returns The uniform width of all grid elements.
     */
    elementWidth(): number;
    /**
     * Sets the virtual element width of this grid component. Defaults to `40`.
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
     * Sets the virtual element height of this grid component. Defaults to `40`.
     * @param height - The virtual element height to apply.
     * @returns The current component instance for method chaining.
     */
    elementHeight(height: number): this;
}
