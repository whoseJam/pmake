import { createRenderNode } from "@/Renderer/RenderNode";
import { Check } from "@/Utility/Check";
import { Rect } from "./Rect";

export class RectSVG extends Rect {
    constructor(target) {
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

        const nake = createRenderNode(this, this.layer(), "rect");
        nake.setAttribute("fill", this.vars.fill);
        nake.setAttribute("stroke", this.vars.stroke);

        this.type("RectSVG");

        this.vars.watch("fill", Factory.action(this, nake, "fill", Interp.colorInterp));
        this.vars.watch("stroke", Factory.action(this, nake, "stroke", Interp.colorInterp));
        this.vars.watch("fillOpacity", Factory.action(this, nake, "fill-opacity", Interp.numberInterp));
        this.vars.watch("strokeOpacity", Factory.action(this, nake, "stroke-opacity", Interp.numberInterp));
        this.vars.watch("strokeWidth", Factory.action(this, nake, "stroke-width", Interp.numberInterp));
        this.vars.watch("strokeDashOffset", Factory.action(this, nake, "stroke-dashoffset", Interp.numberInterp));
        this.vars.watch("strokeDashArray", Factory.action(this, nake, "stroke-dasharray", Interp.arrayInterp));
    }
}

Object.assign(RectSVG.prototype, {
    fill(fill) {
        if (arguments.length === 0) return this.vars.fill;
        Check.validateColor(fill);
        this.vars.fill = fill;
        return this;
    },
    stroke(stroke) {
        if (arguments.length === 0) return this.vars.stroke;
        Check.validateColor(stroke);
        this.vars.stroke = stroke;
        return this;
    },
    fillOpacity(opacity) {
        if (arguments.length === 0) return this.vars.fillOpacity;
        Check.validateOpacity(opacity);
        this.vars.fillOpacity = opacity;
        return this;
    },
    strokeOpacity(opacity) {
        if (arguments.length === 0) return this.vars.strokeOpacity;
        Check.validateOpacity(opacity);
        this.vars.strokeOpacity = opacity;
        return this;
    },
});
