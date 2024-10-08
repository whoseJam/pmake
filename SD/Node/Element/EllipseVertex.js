import { Background } from "@/Rule/Background";

import { Ellipse }     from "@/Node/Nake/Ellipse";
import { BaseElement } from "@/Node/Element/BaseElement";

export function EllipseVertex(parent, value) {
    BaseElement.call(this, parent);

    this.type("EllipseVertex");

    this.childAs("background", new Ellipse(this.layer("background")), Background());

    this.value(value);
}

EllipseVertex.prototype = {
    ...BaseElement.prototype
};
