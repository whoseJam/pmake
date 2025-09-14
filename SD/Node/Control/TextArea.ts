import { Dom } from "@/Dom/Dom";
import { Status } from "@/Interact/Status";
import { BaseControl } from "@/Node/Control/BaseControl";
import { Input } from "@/Node/Control/Input";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class TextArea extends BaseControl {
    constructor(target: SDNode | RenderNode) {
        super(target);

        const object = this.__createHTMLNode("textarea", 80, 100, {
            value: "",
        });

        Dom.addEventListener(object.element(), "beforeinput", (event: Event) => {
            if (!Status.isInteractable()) event.preventDefault();
        });
        Dom.addEventListener(object.element(), "change", (event: Event) => {
            // @ts-ignore
            this.value(event.target.value);
        });

        this.type("TextArea");
    }
    /**
     * Gets the value of the textarea component.
     * @returns The value.
     */
    value(): string;
    /**
     * Sets the value of the textarea component.
     * @param value - The value to apply.
     * @returns The current component instance for method chaining.
     */
    value(value: number | string): this;
    value() {
        return Input.prototype.value.apply(this, arguments);
    }
}
