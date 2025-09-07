import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { Ellipse } from "@/Node/Shape/Ellipse";
import { RenderNode } from "@/Renderer/RenderNode";
import { Rule as R } from "@/Rule/Rule";

export class EllipseVertex extends BaseElement {
    constructor(target: SDNode | RenderNode, value?: any) {
        super(target);

        this.childAs("background", new Ellipse(this), R.background());

        this.type("EllipseVertex");

        this.value(value);
    }
}
