import { Interp } from "@/Animate/Interp";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { Factory } from "@/Utility/Factory";

export class BaseControlSVG extends BaseSVG {
    constructor(target) {
        super(target, "foreignObject");

        this.vars.merge({
            x: 0,
            y: 0,
        });

        this._.foreign = this._.nake;
        this._.foreign.setAttribute("x", 0);
        this._.foreign.setAttribute("y", 0);

        this.vars.watch("x", Factory.action(this, this._.foreign, "x", Interp.numberInterp));
        this.vars.watch("y", Factory.action(this, this._.foreign, "y", Interp.numberInterp));
        this.vars.watch("width", Factory.action(this, this._.foreign, "width", Interp.numberInterp));
        this.vars.watch("height", Factory.action(this, this._.foreign, "height", Interp.numberInterp));
    }
}

Object.assign(BaseControlSVG.prototype, {
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    control() {
        return this._.control;
    },
});
