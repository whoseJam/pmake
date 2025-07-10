import { SD2DNode } from "@/Node/SD2DNode";
import { SDColor } from "@/Utility/Color";

export class BaseText extends SD2DNode {
    constructor(target: SDNode | RenderNode, text?: number | string);
    /**
     * Gets the font size of this text component.
     * @returns The font size.
     */
    fontSize(): number;
    /**
     * Sets the font size of this text component. Defaults to `20`.
     * @param fontSize - The font size to apply.
     * @returns The current component instance for method chaining.
     */
    fontSize(fontSize: number): this;
    /**
     * Gets the text content of this text component.
     * @returns The text content.
     */
    text(): string;
    /**
     * Sets the text content of this text component.
     * @param text - The text content to apply.
     * @returns The current component instance for method chaining.
     * @example
     * // Sets the text content of this text component from "1" to "2".
     * const text = new sd.Text(svg, "1");
     * text.startAnimate().text("2").endAnimate();
     */
    text(text: number | string): this;
    /**
     * Gets the fill color of this text component.
     * @returns The fill color.
     */
    fill(): string;
    /**
     * Sets the fill color of this text component. Defaults to `C.black`.
     * @param fill - The fill color to apply.
     * @returns The current component instance for method chaining.
     */
    fill(fill: string): this;
    /**
     * Gets the stroke color of this text component.
     * @returns The stroke color.
     */
    stroke(): string;
    /**
     * Sets the stroke color of this text component. Defaults to `C.black`.
     * @param stroke - The stroke color to apply.
     * @returns The current component instance for method chaining.
     */
    stroke(stroke: string): this;
    /**
     * Gets the color of this text component.
     * @returns The color, including the fill color and the stroke color.
     */
    color(): SDColor;
    /**
     * Sets the color of this text component.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     * @example
     * // Sets the color of this text component to red.
     * text.startAnimate().color(C.red).endAnimate();
     */
    color(color: string | SDColor): this;
    /**
     * Sets the color of a matched subtext in this text component.
     * @param subtext - The subtext to match.
     * @param color - The color to apply.
     * @param i - Optional index specifying which matched subtext to be colored. Defaults to `1`.
     * @returns The current component instance for method chaining.
     */
    subtextColor(subtext: string, color: string | SDColor, i?: number): this;
    /**
     * Sets the color of all matched subtexts in this text component.
     * @param subtext - The subtext to match.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    subtextColorAll(subtext: string, color: string | SDColor): this;
    /**
     * Sets the color of the first matched subtext in this text component.
     * @param subtext - The subtext to match.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    subtextColorFirst(subtext: string, color: string | SDColor): this;
    /**
     * Sets the color of the last matched subtext in this text component.
     * @param subtext - The subtext to match.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    subtextColorLast(subtext: string, color: string | SDColor): this;
}
