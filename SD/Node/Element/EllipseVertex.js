import { Background } from "@/Rule/Background";

import { Ellipse }     from "@/Node/Nake/Ellipse";
import { BaseElement } from "@/Node/Element/BaseElement";

export function EllipseElement(parent, value) {
    BaseElement.call(this, parent);

    this.type("EllipseElement");

    this.childAs(
        "background",
        new Ellipse(this.layer("background")),
        Background());

    this.value(value);

    return this;
}

EllipseElement.prototype = {
    ...EllipseElement.prototype
};
