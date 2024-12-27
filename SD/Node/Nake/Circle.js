import { Interp } from "@/Animate/Interp";
import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function Circle(parent) {
    BaseNake.call(this, parent, "circle");

    this.type("Circle");

    this.vars.fill = C.white;
    this.vars.stroke = C.black;
    this.vars.merge({
        r: 20,
        cx: 20,
        cy: 20
    });

    this.vars.associate("r", Factory.action(this, this._.nake, "r", Interp.numberInterp));
    this.vars.associate("cx", Factory.action(this, this._.nake, "cx", Interp.numberInterp));
    this.vars.associate("cy", Factory.action(this, this._.nake, "cy", Interp.numberInterp));

    this._.nake.setAttribute("cx", this.vars.cx);
    this._.nake.setAttribute("cy", this.vars.cy);
    this._.nake.setAttribute("r", this.vars.r);
}

Circle.prototype = {
    ...BaseNake.prototype
};

Circle.prototype.r = Factory.handlerLowPrecise("r");
Circle.prototype.cx = Factory.handlerLowPrecise("cx");
Circle.prototype.cy = Factory.handlerLowPrecise("cy");
Circle.prototype.updateList = [
    ...Circle.prototype.updateList
];
Circle.prototype.inRange = SDNode.InRange("circle");

Circle.prototype.x = function (x) {
    if (x === undefined) return this.cx() - this.r();
    return this.cx(x - this.x() + this.cx());
}

Circle.prototype.y = function (y) {
    if (y === undefined) return this.cy() - this.r();
    return this.cy(y - this.y() + this.cy());
}

Circle.prototype.width = function (width) {
    if (width === undefined) return this.r() * 2;
    return this.r(width / 2);
}

Circle.prototype.height = function (height) {
    if (height === undefined) return this.r() * 2;
    return this.r(height / 2);
}
