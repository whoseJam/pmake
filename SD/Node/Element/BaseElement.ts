import { SDNode, SDNodeWithText } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Rule as R, SDRule } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";
import { SDColor } from "@/Utility/Color";
import { ValueManageMixin } from "@/Node/Mixin/ValueManageMixin";

export class BaseElement<B extends SDNode> extends ValueManageMixin(SDNode) {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.vars.merge({
            rate: 1.3,
            value: null,
        });
    }

    __defaultValueRule(): SDRule {
        return function (parent: BaseElement<B>, child: SDNode) {
            const rate = parent.rate();
            const rule = R.centerFixAspect(rate);
            rule(parent, child);
        };
    }

    x(): number;
    x(x: number): this;
    x(x?: number) {
        if (arguments.length === 0) return this.background().x();
        this.background().x(x);
        return this;
    }
    y(): number;
    y(y: number): this;
    y(y?: number) {
        if (arguments.length === 0) return this.background().y();
        this.background().y(y);
        return this;
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return this.background().width();
        this.background().width(width);
        return this;
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return this.background().height();
        this.background().height(height);
        return this;
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
    background(): B {
        return this.child("background") as B;
    }

    inRange(point: [number, number]) {
        return this.background().inRange(point);
    }
}

function backgroundCall(key: string, value?: any) {
    const background = this.background();
    if (arguments.length === 1) return background[key]();
    background[key](value);
    return this;
}
