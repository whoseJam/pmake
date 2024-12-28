import { Vector as V } from "@/Math/Vector";
import { Path } from "@/Node/Nake/Path";
import { Factory } from "@/Utility/Factory";

export function BaseCurve(parent) {
    Path.call(this, parent);

    this.vars.merge({
        x1: 0,
        y1: 0,
        x2: 40,
        y2: 40
    });

    this._.BASE_CURVE = true;
}

BaseCurve.prototype = {
    ...Path.prototype
};

BaseCurve.prototype.x1 = Factory.handlerLowPrecise("x1");
BaseCurve.prototype.y1 = Factory.handlerLowPrecise("y1");
BaseCurve.prototype.x2 = Factory.handlerLowPrecise("x2");
BaseCurve.prototype.y2 = Factory.handlerLowPrecise("y2");

BaseCurve.prototype.dx = function (dx) {
    this.freeze();
    this.source(V.add(this.source(), [dx, 0]));
    this.target(V.add(this.target(), [dx, 0]));
    this.unfreeze();
    return this;
}

BaseCurve.prototype.dy = function (dy) {
    this.freeze();
    this.source(V.add(this.source(), [0, dy]));
    this.target(V.add(this.target(), [0, dy]));
    this.unfreeze();
    return this;
}