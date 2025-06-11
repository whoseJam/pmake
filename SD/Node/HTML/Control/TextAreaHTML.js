import { TextArea } from "@/Node/Control/TextArea";
import { BaseControlHTML } from "@/Node/HTML/Control/BaseControlHTML";

export class TextAreaHTML extends BaseControlHTML {
    constructor(target) {
        super(target, "textarea");

        this.type("TextAreaHTML");

        this.vars.merge({
            width: 80,
            height: 100,
        });

        this._.layer.setAttribute("width", `${this.vars.width}px`);
        this._.layer.setAttribute("height", `${this.vars.height}px`);
        this._.nake.setAttribute("value", "");
    }
}

Object.assign(TextAreaHTML.prototype, {
    value(value) {
        if (value === undefined) return this._.nake.getAttribute("value");
        this._.nake.setAttribute("value", value);
        return this;
    },
});

TextAreaHTML.extend(TextArea);
