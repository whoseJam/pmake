import { BaseControl } from "@/Node/Control/BaseControl";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";

export class Button extends BaseControl {
    constructor(target: SDNode | RenderNode) {
        super(target);

        this.__createHTMLNode("button", 60, 25, {
            fill: C.buttonGrey,
            stroke: C.darkButtonGrey,
            text: "点击",
        });

        this.type("Button");
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
