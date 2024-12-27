import { Interp } from "@/Animate/Interp";
import { Text } from "@/Node/Nake/Text";
import { SDNode } from "@/Node/SDNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function BaseNake(parent, tag) {
    SDNode.call(this, parent);

    this.vars.merge({
        fill: C.black,
        fillOpacity: 1,
        stroke: C.white,
        strokeOpacity: 1,
        strokeWidth: 1,
        strokeDashOffset: 0,
        strokeDashArray: [1, 0]
    });

    this._.nake = new SVGNode(this, this._.layer, tag);

    this.vars.associate("fill", Factory.action(this, this._.nake, "fill", Interp.colorInterp));
    this.vars.associate("stroke", Factory.action(this, this._.nake, "stroke", Interp.colorInterp));
    this.vars.associate("fillOpacity", Factory.action(this, this._.nake, "fill-opacity", Interp.numberInterp));
    this.vars.associate("strokeOpacity", Factory.action(this, this._.nake, "stroke-opacity", Interp.numberInterp));
    this.vars.associate("strokeWidth", Factory.action(this, this._.nake, "stroke-width", Interp.numberInterp));
    this.vars.associate("strokeDashOffset", Factory.action(this, this._.nake, "stroke-dashoffset", Interp.numberInterp));
    this.vars.associate("strokeDashArray", Factory.action(this, this._.nake, "stroke-dasharray", Interp.arrayInterp));

    this._.BASE_NAKE = true;
}

BaseNake.prototype = {
    ...SDNode.prototype
}

BaseNake.prototype.fill = Factory.handler("fill");
BaseNake.prototype.stroke = Factory.handler("stroke");
BaseNake.prototype.fillOpacity = Factory.handlerMediumPrecise("fillOpacity");
BaseNake.prototype.strokeOpacity = Factory.handlerMediumPrecise("strokeOpacity");
BaseNake.prototype.strokeWidth = Factory.handlerMediumPrecise("strokeWidth");
BaseNake.prototype.strokeDashOffset = Factory.handlerMediumPrecise("strokeDashOffset");
BaseNake.prototype.strokeDashArray = Factory.handler("strokeDashArray");

BaseNake.prototype.color = function (color) {
    if (color === undefined) return { main: this.fill(), border: this.stroke() };
    if (typeof (color) === "string") {
        this.fill(color);
        if (this instanceof Text) this.stroke(color);
        else if (Check.isTypeOfLine(this)) this.stroke(color);
    } else this.fill(color.main).stroke(color.border);
    return this;
}
