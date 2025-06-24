import { Interp } from "@/Animate/Interp";
import { Vector as V } from "@/Math/Vector";
import { Circle } from "@/Node/Shape/Circle";
import { BaseShapeSVG } from "@/Node/SVG/Shape/BaseShapeSVG";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

export class CircleSVG extends BaseShapeSVG {
    constructor(target) {
        super(target, "circle");

        this.type("CircleSVG");

        this.vars.merge({
            r: 20,
            cx: 20,
            cy: 20,
        });

        this.vars.associate("r", Factory.action(this, this._.nake, "r", Interp.numberInterp));
        this.vars.associate("cx", Factory.action(this, this._.nake, "cx", Interp.numberInterp));
        this.vars.associate("cy", Factory.action(this, this._.nake, "cy", Interp.numberInterp));

        this._.nake.setAttribute("cx", this.vars.cx);
        this._.nake.setAttribute("cy", this.vars.cy);
        this._.nake.setAttribute("r", this.vars.r);
    }
}

CircleSVG.extend(Circle);

Object.assign(CircleSVG.prototype, {
    ...Circle.prototype,
    r(r) {
        if (arguments.length === 0) return this.vars.r;
        Check.validateNumber(r, `${this.type()}.r`);
        this.vars.lpset("r", r);
        return this;
    },
    cx(cx) {
        if (arguments.length === 0) return this.vars.cx;
        Check.validateNumber(cx, `${this.type()}.cx`);
        this.vars.lpset("cx", cx);
        return this;
    },
    cy(cy) {
        if (arguments.length === 0) return this.vars.cy;
        Check.validateNumber(cy, `${this.type()}.cy`);
        this.vars.lpset("cy", cy);
        return this;
    },
    inRange(vec) {
        return V.length(V.sub(this.center(), vec)) <= this.r();
    },
    x(x) {
        if (x === undefined) return this.cx() - this.r();
        return this.cx(x - this.x() + this.cx());
    },
    y(y) {
        if (y === undefined) return this.cy() - this.r();
        return this.cy(y - this.y() + this.cy());
    },
    width(width) {
        if (width === undefined) return this.r() * 2;
        return this.r(width / 2);
    },
    height(height) {
        if (height === undefined) return this.r() * 2;
        return this.r(height / 2);
    },
});
