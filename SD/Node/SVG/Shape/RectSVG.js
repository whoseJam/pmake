import { Interp } from "@/Animate/Interp";
import { Rect } from "@/Node/Shape/Rect";
import { BaseShapeSVG } from "@/Node/SVG/Shape/BaseShapeSVG";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

export class RectSVG extends BaseShapeSVG {
    constructor(target) {
        super(target, "rect");

        this.type("RectSVG");

        this.vars.merge({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
        });

        this.vars.watch("x", Factory.action(this, this._.nake, "x", Interp.numberInterp));
        this.vars.watch("y", Factory.action(this, this._.nake, "y", Interp.numberInterp));
        this.vars.watch("width", Factory.action(this, this._.nake, "width", Interp.numberInterp));
        this.vars.watch("height", Factory.action(this, this._.nake, "height", Interp.numberInterp));

        this._.nake.setAttribute("x", this.vars.x);
        this._.nake.setAttribute("y", this.vars.y);
        this._.nake.setAttribute("width", this.vars.width);
        this._.nake.setAttribute("height", this.vars.height);
    }
}

RectSVG.extend(Rect);

Object.assign(RectSVG.prototype, {
    ...Rect.prototype,
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        Check.validateNumber(x, `${this.type()}.x`);
        this.vars.lpset("x", x);
        return this;
    },
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        Check.validateNumber(y, `${this.type()}.y`);
        this.vars.lpset("y", y);
        return this;
    },
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        Check.validateNumber(width, `${this.type()}.width`);
        this.vars.lpset("width", width);
        return this;
    },
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        Check.validateNumber(height, `${this.type()}.height`);
        this.vars.lpset("height", height);
        return this;
    },
});
