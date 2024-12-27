import { Interp } from "@/Animate/Interp";

import { Circle }   from "@/Node/Nake/Circle";
import { BaseNake } from "@/Node/Nake/BaseNake";

import { reactive }       from "@/Node/SDNode/SDValue";
import { Factory } from "@/Utility/Factory"; 
import { Color as C } from "@/Utility/Color";

export function Ellipse(parent) {
    BaseNake.call(this, parent, "ellipse");

    this.type("Ellipse");

    this.vars.fill = C.white;
    this.vars.stroke = C.black;
    this.vars.merge(reactive({
        rx: 20,
        ry: 20,
        cx: 20,
        cy: 20
    }));

    this.vars.associate("rx", Factory.action(this, this._.nake, "rx", Interp.numberInterp));
    this.vars.associate("ry", Factory.action(this, this._.nake, "ry", Interp.numberInterp));
    this.vars.associate("cx", Factory.action(this, this._.nake, "cx", Interp.numberInterp));
    this.vars.associate("cy", Factory.action(this, this._.nake, "cy", Interp.numberInterp));

    this._.nake.setAttribute("cx", this.vars.cx);
    this._.nake.setAttribute("cy", this.vars.cy);
    this._.nake.setAttribute("rx", this.vars.rx);
    this._.nake.setAttribute("ry", this.vars.ry);
}

Ellipse.prototype = {
    ...BaseNake.prototype
};

Ellipse.prototype.cx = Factory.handlerLowPrecise("cx");
Ellipse.prototype.cy = Factory.handlerLowPrecise("cy");
Ellipse.prototype.rx = Factory.handlerLowPrecise("rx");
Ellipse.prototype.ry = Factory.handlerLowPrecise("ry");

Ellipse.prototype.x = function(x) {
    if (x === undefined) return this.cx() - this.rx();
    return this.cx(x - this.x() + this.cx());
}

Ellipse.prototype.y = function(y) {
    if (y === undefined) return this.cy() - this.ry();
    return this.cy(y - this.y() + this.cy());
}

Ellipse.prototype.width = function(width) {
    if (width === undefined) return this.rx() * 2;
    return this.rx(width / 2);
}

Ellipse.prototype.height = function(height) {
    if (height === undefined) return this.ry() * 2;
    return this.ry(height / 2);
}