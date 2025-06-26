import { Interp } from "@/Animate/Interp";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { Factory } from "@/Utility/Factory";

export class BaseShapeHTML extends BaseHTML {
    constructor(target, label) {
        super(target, label);

        this.vars.watch("x", Factory.action(this, this._.layer, "left", Interp.pixelInterp));
        this.vars.watch("y", Factory.action(this, this._.layer, "top", Interp.pixelInterp));
    }
}

Object.assign(BaseShapeHTML.prototype, {
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
});
