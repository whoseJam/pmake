import { Vec, equal } from "../../Utility/Math";
import { Action } from "../../Animate/Action";
import { Interp } from "../../Animate/Interp";
import { Base } from "./Base";

export class Circle extends Base {
    constructor(conf) {
        super(conf, "circle");
        this.g().attr("Circle", "");
    }

    inRange(vec) {
        let center = [this.cx(), this.cy()];
        let length = Vec.length(Vec.sub(vec, center));
        return length <= this._.r;
    }

    x(x) {
        let cx = this._.cx;
        let r = this._.r;
        let ox = cx - r;
        if (x === undefined)
            return ox;
        if (equal(x, ox)) return this;
        this.dirty();
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.cx, r + x,
            Interp.numberInterp(this._.d3, "cx"),
            this, "cx"
        )
        this._.cx = r + x;
        this.children.update();
        return this;
    }

    y(y) {
        let cy = this._.cy;
        let r = this._.r;
        let oy = cy - r;
        if (y === undefined)
            return oy;
        if (equal(y, oy)) return this;
        this.dirty();
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.cy, r + y,
            Interp.numberInterp(this._.d3, "cy"),
            this, "cy"
        )
        this._.cy = r + y;
        this.children.update();
        return this;
    }

    r(r) {
        let or = this._.r;
        if (r === undefined)
            return or;
        if (equal(r, or)) return this;
        this.dirty();
        let x = this.x();
        let y = this.y();
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.r, r,
            Interp.numberInterp(this._.d3, "r"),
            this, "r"
        );
        this._.r = r;
        this.children.update();
        this.x(x); this.y(y);
        return this;
    }

    width(width) {
        if (width === undefined)
            return this.r() * 2;
        return this.r(width / 2);
    }

    height(height) {
        if (height === undefined)
            return this.r() * 2;
        return this.r(height / 2);
    }
}