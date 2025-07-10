import { BaseGrid } from "@/Node/Grid/BaseGrid";

/**
 * Grid component implementing the value-inside-element strategy.
 *
 * Renders a uniform grid where each element is an **`sd.Box`** instance.
 * All cells are guaranteed to be of the same type and size,
 * ensuring consistent layout and rendering behavior across the grid.
 *
 * @example
 * const grid = new sd.Grid(svg).n(5).m(3).startN(1).startM(1);
 * grid.startAnimate().color(1, 2, C.red).endAnimate();
 * grid.startAnimate().axis("col").endAnimate();
 * grid.startAnimate().elementWidth(50).endAnimate();
 */
export class Grid extends BaseGrid {
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
     * @param axis - The axis orientation to apply.
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
     * Gets the element width of this grid component.
     * @returns The uniform width of all grid elements.
     */
    elementWidth(): number;
    /**
     * Sets the element width of this grid component. Defaults to `40`.
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
     * Sets the element height of this grid component. Defaults to `40`.
     * @param width - The uniform height of all grid elements.
     * @returns The current component instance for method chaining.
     */
    elementHeight(height: number): this;
}
