import { BaseElement } from "@/Node/Element/BaseElement";
import { Rect } from "@/Node/Nake/Rect";
import { Rule as R } from "@/Rule/Rule";

export function Box(parent, value) {
    BaseElement.call(this, parent);

    this.type("Box");

    const background = new Rect(this.layer("background"))

    this.vars.background = background;

    this.childAs("background", background, R.background());

    this.value(value);
}

Box.prototype = {
    ...BaseElement.prototype
};
