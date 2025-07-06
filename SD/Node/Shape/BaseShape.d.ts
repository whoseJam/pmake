import { SD2DNode } from "@/Node/SD2DNode";
import { SDColor } from "@/Utility/Color";
import { Polygon } from "@flatten-js/core";

export class BaseShape extends SD2DNode {
    toPolygon(): Polygon;
    /**
     * Gets the fill color of this shape component.
     * @returns The fill color.
     */
    fill(): string;
    /**
     * Sets the fill color of this shape component. Default to `C.white`.
     * @param fill - The fill color to apply.
     * @returns The current component instance for method chaining.
     */
    fill(fill: string): this;
    /**
     * Gets the fill opacity of this shape component.
     * @returns The fill opacity.
     */
    fillOpacity(): number;
    /**
     * Sets the fill opacity of this shape component. Default to `1`.
     * @param opacity - The fill opacity to apply.
     * @returns The current component instance for method chaining.
     */
    fillOpacity(opacity: number): this;
    /**
     * Gets the stroke color of this shape component.
     * @returns The stroke color.
     */
    stroke(): string;
    /**
     * Sets the stroke color of this shape component. Default to `C.black`.
     * @param stroke - The stroke color to apply.
     * @returns The current component instance for method chaining.
     */
    stroke(stroke: string): this;
    /**
     * Gets the stroke opacity of this shape component.
     * @returns The stroke opacity.
     */
    strokeOpacity(): number;
    /**
     * Sets the stroke opacity of this shape component. Default to `1`.
     * @param opacity - The stroke opacity to apply.
     * @returns The current component instance for method chaining.
     */
    strokeOpacity(opacity: number): this;
    /**
     * Gets the stroke width of this shape component.
     * @returns The stroke width.
     */
    strokeWidth(): number;
    /**
     * Sets the stroke width of this shape component. Default to `1`.
     * @param width - The stroke width to apply.
     * @returns The current component instance for method chaining.
     */
    strokeWidth(width: number): this;
    /**
     * Gets the stroke dash offset of this shape component.
     * @returns The stroke dash offset.
     */
    strokeDashOffset(): number;
    /**
     * Sets the stroke dash offset of this shape component. Default to `0`.
     * @param offset - The stroke dash offset to apply.
     * @returns The current component instance for method chaining.
     */
    strokeDashOffset(offset: number): this;
    /**
     * Gets the stroke dash array of this shape component.
     * @returns The stroke dash array.
     */
    strokeDashArray(): Array<number>;
    /**
     * Sets the stroke dash array of this shape component. Default to `[1, 0]`.
     * @param array - The stroke dash array to apply.
     * @returns The current component instance for method chaining.
     */
    strokeDashArray(array: Array<number>): this;
    /**
     * Gets the color of this shape component.
     * @returns The color.
     */
    color(): SDColor;
    /**
     * Sets the color of this shape component.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    color(color: string | SDColor): this;
}
