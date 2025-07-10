import { SDNode } from "@/Node/SDNode";

type XLocator = "x" | "cx" | "mx";
type YLocator = "y" | "cy" | "my";

export class SD2DNode extends SDNode {
    /**
     * Gets the current opacity of this component.
     * @returns The opacity of the component.
     */
    opacity(): number;
    /**
     * Sets the opacity of this component. Defaults to `1`.
     * @param opacity - The opacity to apply.
     * @returns The current component instance for method chaining.
     */
    opacity(opacity: number): this;
    inRange(point: [number, number]): boolean;
    /**
     * Gets the x coordinate of this component.
     * @returns The x coordinate.
     */
    x(): number;
    /**
     * Sets the x coordinate of this component.
     * @param x - The x coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    x(x: number): this;
    /**
     * Gets the y coordinate of this component.
     * @returns The y coordinate.
     */
    y(): number;
    /**
     * Sets the y coordinate of this component.
     * @param y - The y coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    y(y: number): this;
    /**
     * Gets the width of this component.
     * @returns The width.
     */
    width(): number;
    /**
     * Sets the width of this component.
     * @param width - The width to apply.
     * @returns The current component instance for method chaining.
     */
    width(width: number): this;
    /**
     * Gets the height of this component.
     * @returns The height.
     */
    height(): number;
    /**
     * Sets the height of this component.
     * @param height - The height to apply.
     * @returns The current component instance for method chaining.
     */
    height(height: number): this;
    scale(scale: number): this;
    /**
     * Sets the coordinate of this component.
     * @param x - The x coordinate to apply.
     * @param y - The y coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    pos(x: number, y: number): this;
    /**
     * Sets the coordinate of this component.
     * @param v - The coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    pos(v: [number, number]): this;
    /**
     * Gets a calculated coordinate pair for the component based on specified locators and offsets.
     * @param lx - The locator of x coordinate.
     *             - "x": Uses the x coordinate of this component to calculate.
     *             - "cx": Uses the cx coordinate of this component to calculate.
     *             - "mx": Uses the mx coordinate of this component to calculate.
     * @param ly - The locator of y coordinate.
     *             - "y": Uses the y coordinate of this component to calculate.
     *             - "cy": Uses the cy coordinate of this component to calculate.
     *             - "my": Uses the my coordinate of this component to calculate.
     * @param dx - The offset of x coordinate.
     * @param dy - The offset of y coordinate.
     * @returns The target coordinate.
     * @example
     * const point = rect.pos("mx", "cy", +10, -5);
     */
    pos(lx: string, ly: string, dx?: number, dy?: number): [number, number];
    /**
     * Sets the coordinate of this component.
     * @param x - The x coordinate to apply.
     * @param y - The y coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    position(x: number, y: number): this;
    /**
     * Sets the coordinate of this component.
     * @param v - The coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    position(v: [number, number]): this;
    /**
     * Gets a calculated coordinate pair for the component based on specified locators and offsets.
     * @param lx - The locator of x coordinate.
     *             - "x": Uses the x coordinate of this component to calculate.
     *             - "cx": Uses the cx coordinate of this component to calculate.
     *             - "mx": Uses the mx coordinate of this component to calculate.
     * @param ly - The locator of y coordinate.
     *             - "y": Uses the y coordinate of this component to calculate.
     *             - "cy": Uses the cy coordinate of this component to calculate.
     *             - "my": Uses the my coordinate of this component to calculate.
     * @param dx - The offset of x coordinate.
     * @param dy - The offset of y coordinate.
     * @returns The target coordinate.
     * @example
     * const point = rect.pos("mx", "cy", +10, -5);
     */
    position(lx: string, ly: string, dx?: number, dy?: number): [number, number];
    /**
     * Gets the center coordinate of this component.
     * @return The center coordinate.
     */
    center(): [number, number];
    /**
     * Sets the center coordinate of this component.
     * @param center - The center coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    center(center: [number, number]): this;
    /**
     * Sets the center coordinate of this component.
     * @param cx - The cx coordinate to apply.
     * @param cy - The cy coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    center(cx: number, cy: number): this;
    /**
     * Gets the k-th quantile of x coordinate of this component.
     * @param k - Quantile to apply between 0 and 1.
     * @returns The x coordinate corresponding to the k-th quantile.
     * @example
     * // Gets the cx of this component.
     * const cx = rect.kx(0.5);
     */
    kx(k: number): number;
    /**
     * Gets the k-th quantile of y coordinate of this component.
     * @param k - Quantile to apply between 0 and 1.
     * @returns The y coordinate corresponding to the k-th quantile.
     * @example
     * // Gets the cy of this component.
     * const cy = rect.ky(0.5);
     */
    ky(k: number): number;
    /**
     * Translates the x coordinate of this component by a specified delta.
     * @param dx - The delta to apply.
     * @returns The current component instance for method chaining.
     */
    dx(dx: number): this;
    /**
     * Translates the y coordinate of this component by a specified delta.
     * @param dy - The delta to apply.
     * @returns The current component instance for method chaining.
     */
    dy(dy: number): this;
    /**
     * Gets the cx coordinate of this component.
     * @returns The cx coordinate.
     */
    cx(): number;
    /**
     * Sets the cx coordinate of this component.
     * @param cx - The cx coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    cx(cx: number): this;
    /**
     * Gets the cy coordinate of this component.
     * @returns The cy coordinate.
     */
    cy(): number;
    /**
     * Sets the cy coordinate of this component.
     * @param cy - The cy coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    cy(cy: number): this;
    /**
     * Gets the mx coordinate of this component.
     * @returns The mx coordinate.
     */
    mx(): number;
    /**
     * Sets the mx coordinate of this component.
     * @param mx - The mx coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    mx(mx: number): this;
    /**
     * Gets the my coordinate of this component.
     * @returns The my coordinate.
     */
    my(): number;
    /**
     * Sets the my coordinate of this component.
     * @param my - The my coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    my(my: number): this;
}
