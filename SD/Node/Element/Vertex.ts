import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { Circle } from "@/Node/Shape/Circle";
import { RenderNode } from "@/Renderer/RenderNode";
import { Rule as R } from "@/Rule/Rule";

export class Vertex extends BaseElement {
    constructor(target: SDNode | RenderNode, value?: any) {
        super(target);

        this.childAs("background", new Circle(this), R.circleBackground());

        this.type("Vertex");

        this.value(value);
    }
    r(): number;
    r(r: number): this;
    r(r?: number) {
        if (arguments.length === 0) return Circle.prototype.r.call(this);
        return Circle.prototype.r.call(this, r);
    }
    width(): number;
    width(width: number): this;
    width(width?: number) {
        if (arguments.length === 0) return Circle.prototype.width.call(this);
        return Circle.prototype.width.call(this, width);
    }
    height(): number;
    height(height: number): this;
    height(height?: number) {
        if (arguments.length === 0) return Circle.prototype.height.call(this);
        return Circle.prototype.height.call(this, height);
    }
    inRange(point) {
        return Circle.prototype.inRange.call(this, point);
    }
}
