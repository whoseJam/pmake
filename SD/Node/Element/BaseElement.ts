import { ValueManageMixin } from "@/Node/Mixin/ValueManageMixin";
import { SDNode } from "@/Node/SDNode";
import { SDSVGNode } from "@/Node/SDSVGNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Rule as R, SDRule } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";
import { SDAllColor, SDPacketColor, SDRGBColor } from "@/Utility/Color";

console.log(ValueManageMixin(SDNode).prototype);

export class BaseElement<B extends SDSVGNode> extends ValueManageMixin(SDNode) {
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
            R.centerContentFit(rate)(parent, child);
        };
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
    color(): SDPacketColor;
    /**
     * Sets the color of this element component.
     * @param color - The color to apply.
     * @returns The current component instance for method chaining.
     */
    color(color: SDAllColor): this;
    color(color?: SDAllColor) {
        if (arguments.length === 0) return this.background().color();
        this.background().color(color);
        return this;
    }

    /**
     * Gets the fill color of this element component.
     * @returns The fill color.
     */
    fill(): SDRGBColor;
    /**
     * Sets the fill color of this element component.
     * @param fill - The fill color to apply (hex string or RGB object).
     * @returns The current component instance for method chaining.
     */
    fill(fill: SDAllColor): this;
    fill(fill?: SDAllColor) {
        if (arguments.length === 0) return this.background().fill();
        this.background().fill(fill);
        return this;
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
        if (arguments.length === 0) return this.background().fillOpacity();
        this.background().fillOpacity(opacity);
        return this;
    }

    /**
     * Gets the stroke color of this element component.
     * @returns The stroke color.
     */
    stroke(): SDRGBColor;
    /**
     * Sets the stroke color of this element component. Defaults to `C.black`.
     * @param stroke - The stroke color to apply (hex string or RGB object).
     * @returns The current component instance for method chaining.
     */
    stroke(stroke: SDAllColor): this;
    stroke(stroke?: SDAllColor) {
        if (arguments.length === 0) return this.background().stroke();
        this.background().stroke(stroke);
        return this;
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
        if (arguments.length === 0) return this.background().strokeOpacity();
        this.background().strokeOpacity(opacity);
        return this;
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
        if (arguments.length === 0) return this.background().strokeWidth();
        this.background().strokeWidth(width);
        return this;
    }

    strokeDashOffset(): number;
    strokeDashOffset(offset: number): this;
    strokeDashOffset(offset?: number) {
        if (arguments.length === 0) return this.background().strokeDashOffset();
        this.background().strokeDashOffset(offset);
        return this;
    }

    strokeDashArray(): Array<number>;
    strokeDashArray(array: Array<number>): this;
    strokeDashArray(array?: Array<number>) {
        if (arguments.length === 0) return this.background().strokeDashArray();
        this.background().strokeDashArray(array);
        return this;
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

console.log(BaseElement.prototype);
