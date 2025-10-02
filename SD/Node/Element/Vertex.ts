import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { Circle } from "@/Node/Shape/Circle";
import { RenderNode } from "@/Renderer/RenderNode";
import { Rule as R } from "@/Rule/Rule";

export class Vertex extends BaseElement<Circle> {
    constructor(target: SDNode | RenderNode, value?: any) {
        super(target);

        this.childAs("background", new Circle(this), R.circleBackground());

        this.type("Vertex");

        this.value(value);
    }
    r(): number;
    r(r: number): this;
    r(r?: number) {
        if (arguments.length === 0) return this.background().r();
        this.background().r(r);
        return this;
    }
}
