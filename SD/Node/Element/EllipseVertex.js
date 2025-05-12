import { Enter as EN } from "@/Node/Core/Enter";
import { BaseElement } from "@/Node/Element/BaseElement";
import { EllipseSVG } from "@/Node/SVG/EllipseSVG";
import { Rule as R } from "@/Rule/Rule";

export function EllipseVertex(parent, value) {
    BaseElement.call(this, parent);

    this.type("EllipseVertex");

    const background = new EllipseSVG(this.layer("background")).onEnter(EN.appear("background"));
    this.childAs("background", background, R.background());

    this.value(value);
}

EllipseVertex.prototype = {
    ...BaseElement.prototype,
};
