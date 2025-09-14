import { Enter as EN } from "@/Node/Core/Enter";
import { Exit as EX } from "@/Node/Core/Exit";
import { SDNode, SDNodeWithText } from "@/Node/SDNode";
import { Rect } from "@/Node/Shape/Rect";
import { RenderNode } from "@/Renderer/RenderNode";
import { Rule as R, SDRule } from "@/Rule/Rule";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { SDColor } from "@/Utility/Color";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export class BaseElement extends SDNode {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.vars.merge({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            rate: 1.3,
            value: null,
        });
    }
    x(): number;
    x(x: number): this;
    x() {
        return Rect.prototype.x.apply(this, arguments);
    }
    y(): number;
    y(y: number): this;
    y() {
        return Rect.prototype.y.apply(this, arguments);
    }
    width(): number;
    width(width: number): this;
    width() {
        return Rect.prototype.width.apply(this, arguments);
    }
    height(): number;
    height(height: number): this;
    height() {
        return Rect.prototype.height.apply(this, arguments);
    }
    /**
     * Gets the visual representation scaling factor of this element component.
     * @returns The scaling factor used for proportional sizing.
     */
    rate(): number;
    /**
     * Sets the visual representation scaling factor of this element component. Defaults to `1.2`.
     *
     * This method adjusts the perceived size of the component's value display.
     * A higher rate value results in a smaller visual representation, while a lower
     * rate increases the perceived size. This is useful for maintaining proportional
     * scaling across different component instances.
     * @param rate - The scaling factor to apply.
     * @returns The current component instance for method chaining.
     */
    rate(rate: number): this;
    rate(rate?: number) {
        if (arguments.length === 0) return this.vars.rate;
        Check.validateNumber(rate, `${this.constructor.name}.rate`);
        this.vars.mpset("rate", rate);
        return this;
    }
    /**
     * Gets the color of this element component.
     * @returns The color.
     */
    color(): SDColor;
    /**
     * Sets the color of this element component.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    color(color: string | SDColor): this;
    color(color?: string | SDColor) {
        if (arguments.length === 0) return backgroundCall("color");
        return backgroundCall("color", color);
    }
    /**
     * Gets the fill color of this element component.
     * @returns The fill color.
     */
    fill(): string;
    /**
     * Sets the fill color of this element component.
     * @param fill - The fill color to apply.
     * @returns The current component instance for method chaining.
     */
    fill(fill: string): this;
    fill(fill?: string) {
        if (arguments.length === 0) return backgroundCall("fill");
        return backgroundCall("fill", fill);
    }
    /**
     * Gets the fill opacity of this element component.
     * @returns The fill opacity.
     */
    fillOpacity(): number;
    /**
     * Sets the fill opacity of this element component.
     * @param opacity - The fill opacity to apply.
     * @returns The current component instance for method chaining.
     */
    fillOpacity(opacity: number): this;
    fillOpacity(opacity?: number) {
        if (arguments.length === 0) return backgroundCall("fillOpacity");
        return backgroundCall("fillOpacity", opacity);
    }
    /**
     * Gets the stroke color of this element component.
     * @returns The stroke color.
     */
    stroke(): string;
    /**
     * Sets the stroke color of this element component. Defaults to `C.black`.
     * @param stroke - The stroke color to apply.
     * @returns The current component instance for method chaining.
     */
    stroke(stroke: string): this;
    stroke(stroke?: string) {
        if (arguments.length === 0) return backgroundCall("stroke");
        return backgroundCall("stroke", stroke);
    }
    /**
     * Gets the stroke opacity of this element component.
     * @returns The stroke opacity.
     */
    strokeOpacity(): number;
    /**
     * Sets the stroke opacity of this element component.
     * @param opacity - The stroke opacity to apply.
     * @returns The current component instance for method chaining.
     */
    strokeOpacity(opacity: number): this;
    strokeOpacity(opacity?: number) {
        if (arguments.length === 0) return backgroundCall("strokeOpacity");
        return backgroundCall("strokeOpacity", opacity);
    }
    /**
     * Gets the stroke width of this element component.
     * @returns The stroke width.
     */
    strokeWidth(): number;
    /**
     * Sets the stroke width for this element component. Defaults to `1`.
     * @param width - The stroke width to apply.
     * @returns The current component instance for method chaining.
     */
    strokeWidth(width: number): this;
    strokeWidth(width?: number) {
        if (arguments.length === 0) return backgroundCall("strokeWidth");
        return backgroundCall("strokeWidth", width);
    }
    strokeDashOffset(): number;
    strokeDashOffset(offset: number): this;
    strokeDashOffset(offset?: number) {
        if (arguments.length === 0) return backgroundCall("strokeDashOffset");
        return backgroundCall("strokeDashOffset", offset);
    }
    strokeDashArray(): Array<number>;
    strokeDashArray(array: Array<number>): this;
    strokeDashArray(array?: Array<number>) {
        if (arguments.length === 0) return backgroundCall("strokeDashArray");
        return backgroundCall("strokeDashArray", array);
    }
    /**
     * Gets the background component of this element component.
     * @returns The background component instance.
     */
    background() {
        return this.child("background");
    }
    /**
     * Casts the value component to its string representation.
     * - If the value component does not exist, returns an empty string ("").
     * - If the value component cannot be casted to a string, throws an Error.
     * @returns The string representation of the value component.
     */
    text(): string;
    /**
     * Sets the text content of the value component.
     * - If the value component does not exist, creates a new **`sd.Text`** instance to hold the text.
     * - If the value component value does not support text formatting, throws an Error.
     * @param text - The text content to apply.
     * @returns The current component instance for method chaining.
     */
    text(text: string | number): this;
    text(text?: string | number) {
        const value = this.value() as SDNodeWithText;
        if (arguments.length === 0) {
            if (!value) return "";
            if (!value.text) ErrorLauncher.methodNotFound(value, "text");
            return value.text();
        } else {
            if (!value) return this.value(text);
            if (!value.text) ErrorLauncher.methodNotFound(value, "text");
            value.text(text);
            return this;
        }
    }
    /**
     * Casts the value component to its integer representation.
     * - If the value component does not exists, returns zero.
     * - If the value component cannot be casted to an integer, throws an Error.
     * @returns The integer representation of the value component.
     */
    intValue() {
        const value = this.value() as SDNodeWithText;
        if (!value) return 0;
        if (!value.text) ErrorLauncher.methodNotFound(value, "text");
        const i = Math.floor(+value.text());
        if (isNaN(i)) ErrorLauncher.failToParseAsIntValue(value.text());
        return i;
    }
    /**
     * Gets the value component of this element component.
     * @returns The value component instance, or undefined if no value component has been set.
     */
    value(): SDNode;
    /**
     * Sets the value component of this element component.
     * - Replaces any existing value component with the provided value.
     * - Removes the current value without replacement if provided value is null or undefined.
     * - Converts to **`sd.Text`** instance if provided value is number or string.
     * @param value - The provided value.
     * @param rule - Optional responsive rule.
     * @returns The current component instance for method chaining.
     */
    value(value: any, rule?: SDRule): this;
    value(value?: any, rule?: SDRule) {
        if (arguments.length === 0) return this.child("value");
        if (this.hasChild("value")) this.eraseChild("value");
        if (Check.isEmpty(value)) return this;
        value = Cast.castToSDNode(this, value);
        return this.childAs("value", value, rule || valueRule);
    }
    /**
     * Sets the value component of this element component with an animated transition from its current position.
     *
     * Unlike standard value assignment, this method animates the movement of value component
     * from its original position to the new target position within the element component.
     * @param value - The provided value component.
     * @param rule - Optional responsive rule.
     * @returns The current component instance for method chaining.
     */
    valueFromExist(value: SDNode, rule?: SDRule) {
        if (this.hasChild("value")) this.eraseChild("value");
        value.onEnter(EN.moveTo());
        this.childAs("value", value, rule || valueRule);
        return this;
    }
    /**
     * Detaches the value component from this element component while preserving it in the scene.
     * - Removes association between the value component and this element component.
     * - Leaves the value component present in the scene.
     * - Returns the detached component for potential reuse.
     * @returns The detached value component instance, or undefined if no value component was present.
     */
    drop() {
        const value = this.value();
        if (!value) return undefined;
        value.onExit(EX.drop());
        this.eraseChild(value);
        return value;
    }
}

function backgroundCall(key: string, value?: any) {
    const background = this.background();
    if (arguments.length === 1) return background[key]();
    background[key](value);
    return this;
}

function valueRule(parent: BaseElement, child: SDNode) {
    const rate = parent.rate();
    R.centerFixAspect(rate)(parent, child);
}
