import { BaseControl } from "@/Node/Control/BaseControl";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";

export class Button extends BaseControl {
    constructor(args?: { x?: number; y?: number; width?: number; height?: number; text?: string }) {
        super();

        this.__createHTMLNode("button", {
            x: args?.x ?? 0,
            y: args?.y ?? 0,
            width: args?.width ?? 60,
            height: args?.height ?? 25,
            fill: C.buttonGrey,
            stroke: C.darkButtonGrey,
            text: args?.text ?? "点击",
        });

        this.setType("Button");
    }
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
    text(text?: string) {
        if (arguments.length === 0) return this.vars.text;
        Check.validateNumberOrString(text, `${this.constructor.name}.text`);
        this.vars.text = text;
        return this;
    }
}
