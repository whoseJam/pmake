import { BaseControl } from "@/Node/Control/BaseControl";

export class Slider extends BaseControl {
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
    /**
     * Sets the change callback of the slider component.
     * @param onChange - The callback to apply.
     * @returns The current component instance for method chaining.
     */
    onChange(onChange: (value: number) => void): this;
    /**
     * Removes the change callback of the slider component.
     * @param onChange - The empty type.
     * @returns The current component instance for method chaining.
     */
    onChange(onChange: false | null | undefined): this;
}
