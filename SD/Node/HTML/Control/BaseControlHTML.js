import { Interp } from "@/Animate/Interp";
import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { Factory } from "@/Utility/Factory";

export class BaseControlHTML extends BaseHTML {
    constructor(target, label) {
        super(target, label);

        this.vars.watch("width", Factory.action(this, this._.layer, "width", Interp.pixelInterp));
        this.vars.watch("height", Factory.action(this, this._.layer, "height", Interp.pixelInterp));
    }
}

Object.assign(BaseControlHTML.prototype, {
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    control() {
        return this._.nake;
    },
});
