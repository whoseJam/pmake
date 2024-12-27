import { Interp } from "@/Animate/Interp";

import { Color as C } from "@/Utility/Color";

import { BaseNake }       from "@/Node/Nake/BaseNake";
import { reactive }       from "@/Node/SDNode/SDValue";
import { Factory } from "@/Utility/Factory";

export function Rect(parent) {
    BaseNake.call(this, parent, "rect");

    this.type("Rect");

    this.vars.merge(reactive({
        x: 0,
        y: 0,
        width: 40,
        height: 40
    }));
    this.vars.fill = C.white;
    this.vars.stroke = C.black;

    this.vars.associate("x", Factory.action(this, this._.nake, "x", Interp.numberInterp));
    this.vars.associate("y", Factory.action(this, this._.nake, "y", Interp.numberInterp));
    this.vars.associate("width", Factory.action(this, this._.nake, "width", Interp.numberInterp));
    this.vars.associate("height", Factory.action(this, this._.nake, "height", Interp.numberInterp));

    this._.nake.setAttribute("fill", this.vars.fill);
    this._.nake.setAttribute("stroke", this.vars.stroke);
    this._.nake.setAttribute("x", this.vars.x);
    this._.nake.setAttribute("y", this.vars.y);
    this._.nake.setAttribute("width", this.vars.width);
    this._.nake.setAttribute("height", this.vars.height);
}

Rect.prototype = {
    ...BaseNake.prototype
}

Rect.prototype.x = Factory.handlerLowPrecise("x");
Rect.prototype.y = Factory.handlerLowPrecise("y");
Rect.prototype.width = Factory.handlerLowPrecise("width");
Rect.prototype.height = Factory.handlerLowPrecise("height");
