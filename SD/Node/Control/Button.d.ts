import { BaseControl } from "@/Node/Control/BaseControl";

export class Button extends BaseControl {
    /**
     * Gets the text content of the button component.
     * @returns The text content.
     */
    text(): string;
    /**
     * Sets the text content of the button component.
     * @param text - The text content to apply.
     * @returns The current component instance for method chaining.
     */
    text(text: string): this;
}
