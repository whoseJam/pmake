import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { Circle } from "@/Node/Shape/Circle";
import { RenderNode } from "@/Renderer/RenderNode";
import { Rule as R, SDRule } from "@/Rule/Rule";

export class Vertex extends BaseElement<Circle> {
    constructor(target: SDNode | RenderNode, value?: any) {
        super(target);

        this.childAs("background", new Circle(this), R.circleBackground());

        this.type("Vertex");

        this.value(value);
    }

    __defaultValueRule(): SDRule {
        return function (parent: Vertex, child: SDNode) {
            const rate = parent.rate();
            R.centerCircleContentFit(rate)(parent, child);
        };
    }

    r(): number;
    r(r: number): this;
    r(r?: number) {
        if (arguments.length === 0) return this.background().r();
        this.background().r(r);
        return this;
    }
}
