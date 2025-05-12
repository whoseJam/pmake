import { Enter as EN } from "@/Node/Core/Enter";
import { BaseElement } from "@/Node/Element/BaseElement";
import { CircleSVG } from "@/Node/SVG/CircleSVG";
import { Rule as R } from "@/Rule/Rule";
import { Factory } from "@/Utility/Factory";

export function Vertex(parent, value) {
    BaseElement.call(this, parent);

    this.type("Vertex");

    this.vars.merge({
        r: 20,
    });

    const background = new CircleSVG(this.layer("background")).onEnter(EN.appear("background"));
    this.childAs("background", background, R.circleBackground());

    this.value(value);
}

Vertex.prototype = {
    ...BaseElement.prototype,
    r: Factory.handlerLowPrecise("r"),
    width: CircleSVG.prototype.width,
    height: CircleSVG.prototype.height,
    inRange: CircleSVG.prototype.inRange,
};
