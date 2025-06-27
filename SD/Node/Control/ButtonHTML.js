import { Interp } from "@/Animate/Interp";
import { BaseControl } from "@/Node/Control/BaseControl";
import { Button } from "@/Node/Control/Button";
import { ControlHTML } from "@/Node/Control/ControlHTML";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export class ButtonHTML extends BaseControl {
    constructor(target) {
        super(target);

        ControlHTML.call(this, "button");

        this.type("ButtonHTML");

        this.vars.width = 60;
        this.vars.height = 25;
        this.vars.fill = C.buttonGrey;
        this.vars.stroke = C.darkButtonGrey;
        this.vars.merge({
            text: "点击",
        });

        this._.nake.setAttribute("text", "点击");

        this.vars.watch("text", Factory.action(this, this._.nake, "text", Interp.stringInterp));
    }
}

ButtonHTML.extend(Button);

Object.assign(ButtonHTML.prototype, {
    ...ControlHTML.prototype,
    text(text) {
        if (arguments.length === 0) return this.vars.text;
        Check.validateStringOrNumber(text, `${this.constructor.name}.text`);
        this.vars.text = text;
        return this;
    },
});
