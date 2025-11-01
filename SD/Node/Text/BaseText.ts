import { Window } from "@/Animate/Window";
import { SDNode } from "@/Node/SDNode";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { TextEngine, Transforming } from "@/Node/Text/TextEngine";
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

type TextMappingSubtextItem = [string, string];
type TextMappingObjectSubtextItem = [BaseText, string, string];
type TextMappingObjectItem = [BaseText, string];
type TextMappingItem = TextMappingSubtextItem | TextMappingObjectSubtextItem | TextMappingObjectItem;
export type TextMappingLocation =
    | { i: number; subtext: string }
    | { object: BaseText; subtext: string }
    | string
    | BaseText;
export type TextMappingObject = {
    source: TextMappingLocation;
    target: TextMappingLocation;
};
type TextMappingDictionary = { [key: string]: string };
export type TextMapping = TextMappingDictionary | Array<TextMappingItem>;
export type TextMappingArray = Array<TextMappingObject>;

function processMapping(mapping: TextMapping): TextMappingArray {
    const result = [] as TextMappingArray;
    function processArraySubtextItem(item: TextMappingSubtextItem): TextMappingObject {
        return { source: String(item[0]), target: String(item[1]) };
    }
    function processArrayObjectSubtextItem(item: TextMappingObjectSubtextItem): TextMappingObject {
        return { source: { object: item[0], subtext: String(item[1]) }, target: String(item[2]) };
    }
    function processArrayObjectItem(item: TextMappingObjectItem): TextMappingObject {
        return { source: item[0], target: String(item[1]) };
    }
    function processArrayItem(item: Array<any>): TextMappingObject {
        if (item.length === 3) return processArrayObjectSubtextItem(item as TextMappingObjectSubtextItem);
        if (typeof item[0] === "number" || typeof item[0] === "string")
            return processArraySubtextItem(item as TextMappingSubtextItem);
        return processArrayObjectItem(item as TextMappingObjectItem);
    }
    if (Array.isArray(mapping))
        return mapping.map(item => {
            if (Array.isArray(item)) return processArrayItem(item);
            return item;
        });
    for (const key in mapping) {
        const value = mapping[key];
        result.push({
            source: String(key),
            target: String(value),
        });
    }
    return result;
}

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
        this.node = args.node ?? this.node;
        this.text = args.text ?? args.text;
        this.size = args.size ?? this.size;
        this.fill = args.fill ?? this.fill;
        this.stroke = args.stroke ?? this.stroke;
        this.x = args.x ?? this.x;
        this.y = args.y ?? this.y;
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
    abstract text(text: string | number, mapping?: TextMapping, auto?: boolean): this;
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
        for (const transforming of this._.transformings)
            if (transforming.l === l && transforming.r === r) return transforming;
        return undefined;
    }
    __updateTransforming(args?: TextConfigDictionary) {
        const transforming = this.__getTransforming();
        if (!transforming) return false;
        args = args || {};
        transforming.mapping = args.mapping ? processMapping(args.mapping) : transforming.mapping;
        transforming.auto = args.auto === undefined ? transforming.auto : args.auto;
        transforming.color = args.color === undefined ? transforming.color : args.color;
        transforming.source = this.__getSourceConfiguration();
        transforming.target = this.__getTargetConfiguration();
        if (transforming.source.text === "") {
            transforming.source.x = transforming.target.x;
            transforming.source.y = transforming.target.y;
            transforming.source.size = transforming.target.size;
        }
        transforming.build();
        transforming.createAction();
        return true;
    }
    __createOrUpdateTransforming(args: TextConfigDictionary) {
        if (this.__updateTransforming(args)) return;
        args.mapping = processMapping(args.mapping || []);
        args.auto = args.auto === undefined ? true : args.auto;
        args.color = args.color === undefined ? true : args.color;
        const transforming = TextEngine.transform(this, args.source, args.target, args.mapping, args.auto, args.color);
        this._.transformings.push(transforming);
        transforming.build();
        transforming.createAction();
    }
}
