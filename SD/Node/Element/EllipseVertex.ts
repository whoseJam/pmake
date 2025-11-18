import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { Ellipse } from "@/Node/Shape/Ellipse";
import { RenderNode } from "@/Renderer/RenderNode";
import { Rule as R, SDRule } from "@/Rule/Rule";

export class EllipseVertex extends BaseElement<Ellipse> {
    constructor(target: SDNode | RenderNode, value?: any) {
        super(target);

        this.childAs("background", new Ellipse(this), R.background());

        this.type("EllipseVertex");

        this.value(value);
    }

    __defaultValueRule(): SDRule {
        return function (parent: EllipseVertex, child: SDNode) {
            const rate = parent.rate();
            R.centerEllipseContentFit(rate)(parent, child);
        };
    }
}
