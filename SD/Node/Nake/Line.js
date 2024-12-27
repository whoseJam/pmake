import { Interp } from "@/Animate/Interp";
import { Vector as V } from "@/Math/Vector";
import { BaseLine } from "@/Node/Nake/BaseLine";
import { Factory } from "@/Utility/Factory";

export function Line(parent) {
    BaseLine.call(this, parent, "line");

    this.type("Line");

    this.vars.merge({
        x1: 0,
        y1: 0,
        x2: 40,
        y2: 40
    });

    this.vars.associate("x1", Factory.action(this, this._.nake, "x1", Interp.numberInterp));
    this.vars.associate("y1", Factory.action(this, this._.nake, "y1", Interp.numberInterp));
    this.vars.associate("x2", Factory.action(this, this._.nake, "x2", Interp.numberInterp));
    this.vars.associate("y2", Factory.action(this, this._.nake, "y2", Interp.numberInterp));

    this._.nake.setAttribute("x1", this.vars.x1);
    this._.nake.setAttribute("y1", this.vars.y1);
    this._.nake.setAttribute("x2", this.vars.x2);
    this._.nake.setAttribute("y2", this.vars.y2);
}

Line.prototype = {
    ...BaseLine.prototype
};

Line.prototype.x1 = Factory.handlerLowPrecise("x1");
Line.prototype.y1 = Factory.handlerLowPrecise("y1");
Line.prototype.x2 = Factory.handlerLowPrecise("x2");
Line.prototype.y2 = Factory.handlerLowPrecise("y2");

Line.prototype.at = function (k) {
    const v1 = this.source();
    const v2 = this.target();
    const d = V.sub(v2, v1);
    return V.add(v1, V.numberMul(d, k));
}

Line.prototype.getPointAtLength = function (length) {
    const total = this.totalLength();
    const k = length / total;
    return this.at(k);
}

Line.prototype.totalLength = function () {
    const v1 = this.source();
    const v2 = this.target();
    return V.length(V.sub(v1, v2));
}