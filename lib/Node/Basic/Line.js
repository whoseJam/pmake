import { Action } from "../../Animate/Action";
import { equal } from "../../Utility/Math";
import { Interp } from "../../Animate/Interp";
import { LinkBase } from "./LinkBase";
import { Vec } from "../../Utility/Math";
import { Const } from "../../Utility/Const";

export class Line extends LinkBase {
    constructor(node) {
        super(node, "line");
        this.g().attr("type", "Line");
    }
    
    at(k) {
        let v1 = [this.x1(), this.y1()];
        let v2 = [this.x2(), this.y2()];
        let d = Vec.sub(v2, v1);
        return Vec.add(v1, Vec.numberMul(d, k));
    }
    getPointAtLength(length) {
        let total = this.totalLength();
        let k = length / total;
        return this.at(k);
    }
    totalLength() {
        this.dirtyCheck();
        return Math.sqrt(
            (this._.x1 - this._.x2) * 
            (this._.x1 - this._.x2) + 
            (this._.y1 - this._.y2) *
            (this._.y1 - this._.y2)
        );
    }

    // --------------------位置函数--------------------
    x1(x) {
        this.dirtyCheck();
        if (x === undefined) return this._.x1;
        if (equal(x, this._.x1)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.x1, x,
            Interp.numberInterp(this._.d3, "x1"),
            this, "x1"
        );
        this._.x1 = x;
        this.dirty();
        return this;
    }
    x2(x) {
        this.dirtyCheck();
        if (x === undefined) return this._.x2;
        if (equal(x, this._.x2)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.x2, x,
            Interp.numberInterp(this._.d3, "x2"),
            this, "x2"
        );
        this._.x2 = x;
        this.dirty();
        return this;
    }
    y1(y) {
        this.dirtyCheck();
        if (y === undefined) return this._.y1;
        if (equal(y, this._.y1)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.y1, y,
            Interp.numberInterp(this._.d3, "y1"),
            this, "y1"
        );
        this._.y1 = y;
        this.dirty();
        return this;
    }
    y2(y) {
        this.dirtyCheck();
        if (y === undefined) return this._.y2;
        if (equal(y, this._.y2)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.y2, y,
            Interp.numberInterp(this._.d3, "y2"),
            this, "y2"
        );
        this._.y2 = y;
        this.dirty();
        return this;
    }
}