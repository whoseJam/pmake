import { BaseControl } from "@/Node/Control/BaseControl";

export class Input extends BaseControl {
    /**
     * Gets the value of the input component.
     * @returns The value.
     */
    value(): string;
    /**
     * Sets the value of the input component.
     * @param value - The value to apply.
     * @returns The current component instance for method chaining.
     */
    value(value: number | string): this;
    /**
     * Sets the change callback of the input component.
     * @param onChange - The callback to apply.
     * @returns The current component instance for method chaining.
     */
    onChange(onChange: (value: string) => void): this;
    /**
     * Removes the change callback of the input component.
     * @param onChange - The empty type.
     * @returns The current component instance for method chaining.
     */
    onChange(onChange: false | null | undefined): this;
}
