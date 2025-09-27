import { Window } from "@/Animate/Window";
import { SDNode } from "@/Node/SDNode";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { TextEngine, TextMapping, Transforming } from "@/Node/Text/TextEngine";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { Color as C, SDColor } from "@/Utility/Color";

const BASE_TEXT_ATTRIBUTES = {
    fill: C.black,
    stroke: C.black,
    fillOpacity: 1,
    strokeOpacity: 1,
    strokeWidth: 0,
    strokeOffset: 0,
    strokeDashArray: [1, 0],
};

export type TextConfigDictionary = { [key: string]: any };

export class BaseTextConfiguration {
    node: BaseText;
    text: string;
    size: number;
    fill: string;
    stroke: string;
    x: number;
    y: number;
    constructor(args: TextConfigDictionary) {
        this.node = args.node;
        this.text = args.text;
        this.size = args.size;
        this.fill = args.fill;
        this.stroke = args.stroke;
        this.x = args.x;
        this.y = args.y;
    }
    merge(args: TextConfigDictionary) {
        if (!args) return this;
        this.node = args.node || this.node;
        this.text = args.text || this.text;
        this.size = args.size || this.size;
        this.fill = args.fill || this.fill;
        this.stroke = args.stroke || this.stroke;
        this.x = args.x || this.x;
        this.y = args.y || this.y;
        return this;
    }
}

export abstract class BaseText extends SDSVGNode {
    _: SDSVGNode["_"] & {
        textFrame: number;
        transformings: Array<Transforming>;
        configurations: { [key: number]: TextConfigDictionary };
    };
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
    __flushAll() {
        if (this._.textFrame !== Window.CURRENT_FRAME) {
            this._.textFrame = Window.CURRENT_FRAME;
            this._.transformings = [];
            this._.configurations = {};
        }
    }
    __updateSourceConfiguration(args: TextConfigDictionary) {
        this.__flushAll();
        const key = this.delay();
        const config = this._.configurations;
        config[key] = {
            ...(args || {}),
            ...config[key],
        };
    }
    __updateTargetConfiguration(args: TextConfigDictionary) {
        this.__flushAll();
        const key = this.delay() + this.duration();
        const config = this._.configurations;
        config[key] = {
            ...config[key],
            ...(args || {}),
        };
    }
    abstract __getConfiguration(): BaseTextConfiguration;
    __getSourceConfiguration(): BaseTextConfiguration {
        this.__flushAll();
        const key = this.delay();
        return this.__getConfiguration().merge(this._.configurations[key]);
    }
    __getTargetConfiguration(): BaseTextConfiguration {
        this.__flushAll();
        const key = this.delay() + this.duration();
        return this.__getConfiguration().merge(this._.configurations[key]);
    }
    __getTransforming() {
        this.__flushAll();
        const l = this.delay();
        const r = this.delay() + this.duration();
        for (const transforming of this._.transformings) if (transforming.l === l && transforming.r === r) return transforming;
        return undefined;
    }
    __updateTransforming(args?: TextConfigDictionary) {
        const transforming = this.__getTransforming();
        if (!transforming) return false;
        args = args || {};
        transforming.mapping = args.mapping || transforming.mapping;
        transforming.auto = args.auto === undefined ? transforming.auto : args.auto;
        transforming.color = args.color === undefined ? transforming.color : args.color;
        transforming.source = this.__getSourceConfiguration();
        transforming.target = this.__getTargetConfiguration();
        transforming.build();
        transforming.createAction();
        return true;
    }
    __createOrUpdateTransforming(args: TextConfigDictionary) {
        if (this.__updateTransforming(args)) return;
        args.mapping = args.mapping || [];
        args.auto = args.auto === undefined ? true : args.auto;
        args.color = args.color === undefined ? true : args.color;
        const transforming = TextEngine.transform(this, args.source, args.target, args.mapping, args.auto, args.color);
        transforming.build();
        transforming.createAction();
    }
}
