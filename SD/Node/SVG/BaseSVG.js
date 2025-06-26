import { Interp } from "@/Animate/Interp";
import { SD2DNode } from "@/Node/SD2DNode";
import { createRenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export class BaseSVG extends SD2DNode {
    constructor(target, label) {
        super(target);

        this.vars.merge({
            fill: C.white,
            fillOpacity: 1,
            stroke: C.black,
            strokeOpacity: 1,
            strokeWidth: 1,
            strokeDashOffset: 0,
            strokeDashArray: [1, 0],
        });

        this._.nake = createRenderNode(this, this._.layer, label);
        this._.nake.setAttribute("fill", this.vars.fill);
        this._.nake.setAttribute("stroke", this.vars.stroke);

        this.vars.watch("fill", Factory.action(this, this._.nake, "fill", Interp.colorInterp));
        this.vars.watch("stroke", Factory.action(this, this._.nake, "stroke", Interp.colorInterp));
        this.vars.watch("fillOpacity", Factory.action(this, this._.nake, "fill-opacity", Interp.numberInterp));
        this.vars.watch("strokeOpacity", Factory.action(this, this._.nake, "stroke-opacity", Interp.numberInterp));
        this.vars.watch("strokeWidth", Factory.action(this, this._.nake, "stroke-width", Interp.numberInterp));
        this.vars.watch("strokeDashOffset", Factory.action(this, this._.nake, "stroke-dashoffset", Interp.numberInterp));
        this.vars.watch("strokeDashArray", Factory.action(this, this._.nake, "stroke-dasharray", Interp.arrayInterp));
    }
}

Object.assign(BaseSVG.prototype, {
    fill: Factory.handler("fill"),
    stroke: Factory.handler("stroke"),
    fillOpacity: Factory.handlerMediumPrecise("fillOpacity"),
    strokeOpacity: Factory.handlerMediumPrecise("strokeOpacity"),
    strokeWidth: Factory.handlerMediumPrecise("strokeWidth"),
    strokeDashOffset: Factory.handlerMediumPrecise("strokeDashOffset"),
    strokeDashArray: Factory.handler("strokeDashArray"),
    color(color) {
        if (arguments.length === 0) return { fill: this.fill(), stroke: this.stroke() };
        Check.validateColor(color);
        if (typeof color === "string") {
            this.fill(color);
            const { Text } = require("@/Node/SVG/Text");
            const { BasePathSVG } = require("@/Node/SVG/Path/BasePathSVG");
            if (this instanceof Text || this instanceof BasePathSVG) this.stroke(color);
        } else this.fill(color.fill).stroke(color.stroke);
        return this;
    },
});
