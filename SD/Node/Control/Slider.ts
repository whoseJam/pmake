import { Status } from "@/Interact/Status";
import { BaseControl } from "@/Node/Control/BaseControl";
import { Check } from "@/Utility/Check";
import { Dom } from "@/Utility/Dom";

export class Slider extends BaseControl {
    constructor(args: { x?: number; y?: number; width?: number; height?: number }) {
        super();

        const object = this.__createHTMLNode("input", {
            x: args?.x ?? 0,
            y: args?.y ?? 0,
            width: args?.width ?? 80,
            height: args?.height ?? 20,
            min: 0,
            max: 10,
            value: 0,
            type: "range",
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

        this.setType("Slider");
    }
    /**
     * Gets the maximum value of the slider component's range.
     * @returns The maximum value of the range.
     */
    getMax(): number {
        return this.vars.max;
    }
    /**
     * Sets the maximum value of the slider component's range. Defaults to `10`.
     * @param max - The maximum value to apply.
     * @returns The current component instance for method chaining.
     */
    setMax(max: number) {
        this.vars.lpset("max", max);
        if (this.getValue() > max) this.setValue(max);
        return this;
    }
    /**
     * Gets the minimum value of the slider component's range.
     * @returns The minimum value of the range.
     */
    getMin(): number {
        return this.vars.min;
    }
    /**
     * Sets the minimum value of the slider component's range. Defaults to `0`.
     * @param min - The minimum value to apply.
     * @returns The current component instance for method chaining.
     */
    setMin(min?: number) {
        this.vars.lpset("min", min);
        if (this.getValue() < min) this.setValue(min);
        return this;
    }
    /**
     * Gets the value of the slider component.
     * @returns The value.
     */
    getValue(): number {
        return this.vars.value;
    }
    /**
     * Sets the vlaue of the slider component.
     * @param value The value to apply.
     * @returns The current component instance for method chaining.
     */
    setValue(value?: number) {
        this.vars.lpset("value", value);
        return this;
    }
}
