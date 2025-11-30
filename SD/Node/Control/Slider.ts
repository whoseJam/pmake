import { Status } from "@/Interact/Status";
import { BaseControl } from "@/Node/Control/BaseControl";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { Dom } from "@/Utility/Dom";

export class Slider extends BaseControl {
    constructor(target: SDNode | RenderNode) {
        super(target);

        const object = this.__createHTMLNode("input", 80, 20, {
            min: 0,
            max: 10,
            value: 0,
            type: "range",
            width: "97%",
        });

        Dom.addEventListener(object.element(), "mousedown", e => {
            if (!Status.isInteractable()) e.preventDefault();
        });
        Dom.addEventListener(object.element(), "touchstart", e => {
            if (!Status.isInteractable()) e.preventDefault();
        });
        Dom.addEventListener(object.element(), "change", e => {
            // @ts-ignore
            this.value(+e.target.value);
        });

        this.type("Slider");
    }
    /**
     * Gets the maximum value of the slider component's range.
     * @returns The maximum value of the range.
     */
    max(): number;
    /**
     * Sets the maximum value of the slider component's range. Defaults to `10`.
     * @param max - The maximum value to apply.
     * @returns The current component instance for method chaining.
     */
    max(max: number): this;
    max(max?: number) {
        if (arguments.length === 0) return this.vars.max;
        Check.validateNumber(max, `${this.constructor.name}.max`);
        this.vars.lpset("max", max);
        if (this.value() > max) this.value(max);
        return this;
    }
    /**
     * Gets the minimum value of the slider component's range.
     * @returns The minimum value of the range.
     */
    min(): number;
    /**
     * Sets the minimum value of the slider component's range. Defaults to `0`.
     * @param min - The minimum value to apply.
     * @returns The current component instance for method chaining.
     */
    min(min: number): this;
    min(min?: number) {
        if (arguments.length === 0) return this.vars.min;
        Check.validateNumber(min, `${this.constructor.name}.min`);
        this.vars.lpset("min", min);
        if (this.value() < min) this.value(min);
        return this;
    }
    /**
     * Gets the value of the slider component.
     * @returns The value.
     */
    value(): number;
    /**
     * Sets the vlaue of the slider component.
     * @param value The value to apply.
     * @returns The current component instance for method chaining.
     */
    value(value: number): this;
    value(value?: number) {
        if (arguments.length === 0) return this.vars.value;
        Check.validateNumber(value, `${this.constructor.name}.value`);
        this.vars.lpset("value", value);
        return this;
    }
}
