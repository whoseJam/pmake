import { BasePath } from "@/Node/Path/BasePath";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Line extends BasePath {
    constructor(target: SDNode | RenderNode, value?: any);
    /**
     * Gets the x coordinate of the starting point of this line component.
     * @returns The x coordinate.
     */
    x1(): number;
    /**
     * Sets the x coordinate of the starting point of this line component. Defaults to `0`.
     * @param x - The x coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    x1(x: number): this;
    /**
     * Gets the x coordinate of the ending point of this line component.
     * @returns The x coordinate.
     */
    x2(): number;
    /**
     * Sets the x coordinate of the ending point of this line component. Defaults to `40`.
     * @param x - The x coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    x2(x: number): this;
    /**
     * Gets the y coordinate of the starting point of this line component.
     * @returns The y coordinate.
     */
    y1(): number;
    /**
     * Sets the y coordinate of the starting point of this line component.
     * @param y - The y coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    y1(y: number): this;
    /**
     * Gets the y coordinate of the ending point of this line component.
     * @returns The y coordinate.
     */
    y2(): number;
    /**
     * Sets the y coordinate of the ending point of this line component.
     * @param y - The y coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    y2(y: number): this;
    /**
     * Gets the coordinate of the starting point.
     * @returns The coordinate.
     */
    source(): [number, number];
    /**
     * Sets the coordinate of the starting point.
     * @param vector - The coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    source(vector: [number, number]): this;
    /**
     * Sets the coordinate of the starting point.
     * @param x - The x coordinate to apply.
     * @param y - The y coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    source(x: number, y: number): this;
    /**
     * Gets the coordinate of the ending point.
     * @returns The coordinate.
     */
    target(): [number, number];
    /**
     * Sets the coordinate of the ending point.
     * @param vector - The coordinate to apply.
     * @returns The current component instance for method chaining.
     */
    target(vector: [number, number]): this;
    /**
     * Sets the coordinate of the ending point.
     * @param x - The x coordinate to apply.
     * @param y - The y coordinate to apply.
     * @returns The coordinate.
     */
    target(x: number, y: number): this;
}
