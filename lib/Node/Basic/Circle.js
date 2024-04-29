import { Action } from "../../Animate/Action";
import { Base } from "./Base";
import { equal } from "../../Utility/Math";
import { Interp } from "../../Animate/Interp";
import { Vec } from "../../Utility/Math";
import { Const } from "../../Utility/Const";

export class Circle extends Base {
    constructor(node) {
        super(node, "circle");
        this.g().attr("type", "Circle");
        this._.x = 0;
        this._.y = 0;
        this._.width = 40;
        this._.height = 40;
    }

    // --------------------位置函数--------------------
    inRange(vec) {
        let center = [this.cx(), this.cy()];
        let length = Vec.length(Vec.sub(vec, center));
        return length <= this.r();
    }
    x(x) {
        this.dirtyCheck();
        const r = this._.r;
        if (x === undefined) return this._.x;
        if (equal(x, this._.x)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.cx, r + x,
            Interp.numberInterp(this._.d3, "cx"),
            this, "cx"
        )
        this._.cx = r + x;
        this._.x = x;
        this.dirty();
        return this;
    }
    y(y) {
        this.dirtyCheck();
        const r = this._.r;
        if (y === undefined) return this._.y;
        if (equal(y, this._.y)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.cy, r + y,
            Interp.numberInterp(this._.d3, "cy"),
            this, "cy"
        )
        this._.cy = r + y;
        this._.y = y;
        this.dirty();
        return this;
    }
    r(r) {
        this.dirtyCheck();
        if (r === undefined) return this._.r;
        if (equal(r, this._.r)) return this;
        const x = this.x();
        const y = this.y();
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.r, r,
            Interp.numberInterp(this._.d3, "r"),
            this, "r"
        );
        this._.x = x + r - this._.r;
        this._.y = y + r - this._.y;
        this._.r = r;
        this.x(x);
        this.y(y);
        this.dirty();
        return this;
    }

    width(width) {
        if (width === undefined) return this.r() * 2;
        return this.r(width / 2);
    }

    height(height) {
        if (height === undefined) return this.r() * 2;
        return this.r(height / 2);
    }
}