import { Enter as EN } from "@/Node/Core/Enter";
import { BaseElement } from "@/Node/Element/BaseElement";
import { RectSVG } from "@/Node/SVG/RectSVG";
import { Rule as R } from "@/Rule/Rule";

export function Box(parent, value) {
    BaseElement.call(this, parent);

    this.type("Box");

    const background = new RectSVG(this.layer("background")).onEnter(EN.appear("background"));
    this.childAs("background", background, R.background());

    this.value(value);
}

Box.prototype = {
    ...BaseElement.prototype,
};
