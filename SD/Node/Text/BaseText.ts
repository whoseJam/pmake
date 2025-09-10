import { SDNode } from "@/Node/SDNode";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { Color as C, SDColor } from "@/Utility/Color";

type TextMappingSubtextItem = [string, string];
type TextMappingObjectSubtextItem<T> = [T, string, string];
type TextMappingObjectItem<T> = [T, string];
type TextMappingItem<T> = TextMappingSubtextItem | TextMappingObjectSubtextItem<T> | TextMappingObjectItem<T>;
type TextMappingDictionary = { [key: string]: string };
type TextMappingArray<T> = Array<TextMappingItem<T>>;
export type TextMapping<T> = TextMappingDictionary | TextMappingArray<T>;

const BASE_TEXT_ATTRIBUTES = {
    fill: C.black,
    stroke: C.black,
    fillOpacity: 1,
    strokeOpacity: 1,
    strokeWidth: 0,
    strokeOffset: 0,
    strokeDashArray: [1, 0],
};

export abstract class BaseText extends SDSVGNode {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.vars.merge({
            x: 0,
            y: 0,
        });
    }
    x(): number;
    x(x: number): this;
    x(x?: number) {
        if (arguments.length === 0) return this.vars.x;
        Check.validateNumber(x, `${this.constructor.name}.x`);
        this.vars.lpset("x", x);
        return this;
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        if (arguments.length === 0) return this.vars.y;
        Check.validateNumber(y, `${this.constructor.name}.y`);
        this.vars.lpset("y", y);
        return this;
    }
    /**
     * Gets the font size of this text component.
     * @returns The font size.
     */
    abstract fontSize(): number;
    /**
     * Sets the font size of this text component. Defaults to `20`.
     * @param fontSize - The font size to apply.
     * @returns The current component instance for method chaining.
     */
    abstract fontSize(fontSize: number): this;
    /**
     * Gets the text content of this text component.
     * @returns The text content.
     */
    abstract text(): string;
    /**
     * Sets the text content of this text component.
     * @param text - The text content to apply.
     * @returns The current component instance for method chaining.
     * @example
     * // Sets the text content of this text component from "1" to "2".
     * const text = new sd.Text(svg, "1");
     * text.startAnimate().text("2").endAnimate();
     */
    abstract text(text: string | number, mapping?: TextMapping<this>, auto?: boolean): this;
    /**
     * Sets the color of a matched subtext in this text component.
     * @param subtext - The subtext to match.
     * @param color - The color to apply.
     * @param i - Optional index specifying which matched subtext to be colored. Defaults to `0`.
     * @returns The current component instance for method chaining.
     */
    subtextColor(subtext: string | number, color: string | SDColor, i: number = 0) {
        if (typeof color === "string") color = { fill: color, stroke: color };
        return this.__subtextAttribute(subtext, color, i);
    }
    /**
     * Sets the color of all matched subtexts in this text component.
     * @param subtext - The subtext to match.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    subtextColorAll(subtext: string | number, color: string | SDColor) {
        if (typeof color === "string") color = { fill: color, stroke: color };
        return this.__subtextAttribute(subtext, color, "all");
    }
    /**
     * Sets the color of the first matched subtext in this text component.
     * @param subtext - The subtext to match.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    subtextColorFirst(subtext: string | number, color: string | SDColor) {
        if (typeof color === "string") color = { fill: color, stroke: color };
        return this.__subtextAttribute(subtext, color, "first");
    }
    /**
     * Sets the color of the last matched subtext in this text component.
     * @param subtext - The subtext to match.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    subtextColorLast(subtext: string | number, color: string | SDColor) {
        if (typeof color === "string") color = { fill: color, stroke: color };
        return this.__subtextAttribute(subtext, color, "last");
    }
    abstract __subtextAttribute(subtext: string | number, color: SDColor, i: number | "all" | "first" | "last"): this;
    __createSVGNode(label: string, attributes?: { [key: string]: any }) {
        return super.__createSVGNode(label, {
            ...BASE_TEXT_ATTRIBUTES,
            ...(attributes || {}),
        });
    }
}
