import { Dom } from "@/Dom/Dom";
import { Status } from "@/Interact/Status";
import { BaseControl } from "@/Node/Control/BaseControl";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";

export class Input extends BaseControl {
    constructor(target: SDNode | RenderNode) {
        super(target);

        const object = this.__createHTMLNode("input", 120, 25, {
            value: "",
            type: "text",
        });

        Dom.addEventListener(object.element(), "beforeinput", (event: Event) => {
            if (!Status.isInteractable()) event.preventDefault();
        });
        Dom.addEventListener(object.element(), "change", (event: Event) => {
            // @ts-ignore
            this.value(event.target.value);
        });
    }
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
    value(value: string | number): this;
    value(value?: string | number) {
        if (arguments.length === 0) return this.vars.value;
        Check.validateNumberOrString(value, `${this.constructor.name}.value`);
        this.vars.value = value;
        return this;
    }
}
