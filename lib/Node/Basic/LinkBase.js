import { Interp } from "../../Animate/Interp";
import { PointAtPathByRate } from "../../Rule/Path";
import { Vec, equal } from "../../Utility/Math";
import { SDHelper } from "../../Utility/SDHelper";
import { Action } from "../../slide";
import { Base } from "./Base";

export class LinkBase extends Base {
    constructor(node, type) {
        super(node, type);
        this.newLayer("value");
        this.fillOpacity(0);
    }

    /**
     * 获取LinkBase上的k分位点坐标
     * @param {number} k 
     * @returns k分位点坐标
     */
    at(k) {
        let v1 = [this.x1(), this.y1()];
        let v2 = [this.x2(), this.y2()];
        let d = Vec.sub(v2, v1);
        return Vec.add(v1, Vec.numberMul(d, k));
    }

    /**
     * 获取LinkBase上从起点开始，延伸距离length处的点的坐标
     * @param {number} length 
     * @returns 到起点距离length的点的坐标
     */
    getPointAtLength(length) {
        let total = this.totalLength();
        let k = length / total;
        return this.at(k);
    }

    /**
     * 获取LinkBase的总长度
     * @returns {number} LinkBase的总长度
     */
    totalLength() {
        return Math.sqrt(
            (this._.x1 - this._.x2) * 
            (this._.x1 - this._.x2) + 
            (this._.y1 - this._.y2) *
            (this._.y1 - this._.y2)
        );
    }
    
    source(x, y) {
        if (x === undefined)
            return [this.x1(), this.y1()];
        if (typeof(x) !== "number")
            return this.source(x[0], x[1]);
        this.x1(x).y1(y)
        return this;
    }

    target(x, y) {
        if (x === undefined)
            return [this.x2(), this.y2()];
        if (typeof(x) !== "number")
            return this.target(x[0], x[1]);
        this.x2(x).y2(y);
        return this;
    }

    x(x) {
        let x1 = this.x1();
        let x2 = this.x2();
        let ox = Math.min(x1, x2);
        if (x === undefined)
            return ox;
        let dx = x - ox;
        this.x1(x1 + dx);
        this.x2(x2 + dx);
        return this;
    }

    y(y) {
        let y1 = this.y1();
        let y2 = this.y2();
        let oy = Math.min(y1, y2);
        if (y === undefined)
            return oy;
        let dy = y - oy;
        this.y1(y1 + dy);
        this.y2(y2 + dy);
        return this;
    }

    x1(x) {
        let ox1 = this._.x1;
        if (x === undefined)
            return ox1;
        if (equal(x, ox1)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.x1, x,
            Interp.numberInterp(this._.d3, "x1"),
            this, "x1"
        );
        this._.x1 = x;
        super.update();
        return this;
    }

    x2(x) {
        let ox2 = this._.x2;
        if (x === undefined)
            return ox2;
        if (equal(x, ox2)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.x2, x,
            Interp.numberInterp(this._.d3, "x2"),
            this, "x2"
        );
        this._.x2 = x;
        super.update();
        return this;
    }

    y1(y) {
        let oy1 = this._.y1;
        if (y === undefined)
            return oy1;
        if (equal(y, oy1)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.y1, y,
            Interp.numberInterp(this._.d3, "y1"),
            this, "y1"
        );
        this._.y1 = y;
        super.update();
        return this;
    }

    y2(y) {
        let oy2 = this._.y2;
        if (y === undefined)
            return oy2;
        if (equal(y, oy2)) return this;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.y2, y,
            Interp.numberInterp(this._.d3, "y2"),
            this, "y2"
        );
        this._.y2 = y;
        super.update();
        return this;
    }

    width(width) {
        if (width === undefined)
            return Math.abs(this._.x1 - this._.x2);
        let x1 = this._.x1;
        let x2 = this._.x2;
        if (x1 < x2) this.x2(x1 + width);
        else this.x1(x2 + width);
        return this;
    }
    
    height(height) {
        if (height === undefined)
            return Math.abs(this._.y1 - this._.y2);
        let y1 = this._.y1;
        let y2 = this._.y2;
        if (y1 < y2) this.y2(y1 + height);
        else this.y1(y2 + height);
        return this;
    }

    value(value, rule) {
        if (value === undefined)
            return this.child("value");
        value = SDHelper.any2Slide(this, value);
        let ovalue = this.eraseChild("value");
        if (ovalue) ovalue.remove();
        if (!value) return this;
        value.attachTo(this.layer("value"));
        this.childAs("value", value, rule ? rule : PointAtPathByRate(0.5));
        value.opacity(0);
        value.startAnimate(this);
        value.opacity(1);
        return this;
    }

    markerStart(mark) {
        if (mark === undefined)
            return this._.markerStart;
        mark = (typeof(mark) === "string") ? `url(#${mark})` : "";
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.markerStart, mark,
            Interp.stringInterp(this._.d3, "marker-start"),
            this, "marker-start"
        );
        this._.markerStart = mark;
        return this;
    }

    markerMid(mark) {
        if (mark === undefined)
            return this._.markerMid;
        mark = (typeof(mark) === "string") ? `url(#${mark})` : "";
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.markerMid, mark,
            Interp.stringInterp(this._.d3, "marker-mid"),
            this, "marker-mid"
        );
        this._.markerMid = mark;
        return this;
    }

    markerEnd(mark) {
        if (mark === undefined)
            return this._.markerEnd;
        mark = (typeof(mark) === "string") ? `url(#${mark})` : "";
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.markerEnd, mark,
            Interp.stringInterp(this._.d3, "marker-end"),
            this, "marker-end"
        );
        this._.markerEnd = mark;
        return this;
    }

    arrow() {
        this.markerEnd("arrow");
        return this;
    }

    doubleArrow() {
        this.markerStart("arrow-reverse");
        this.markerEnd("arrow");
        return this;
    }

    pointTo() {
        let len = this.totalLength();
        if (this.isAnimating()) {
            let s = this.delay(), l = this.duration();
            this.endAnimate();
            this.after(s);
            this.strokeDashArray([0, len]);
            this.startAnimate(l).strokeDashArray([len, 0]);
        } else this.strokeDashArray([len, 0]);
        return this;
    }

    pointToAndFade() {
        let len = this.totalLength();
        if (this.isAnimating()) {
            let s = this.delay(), l = this.duration();
            this.endAnimate();
            this.after(s);
            this.strokeDashArray([len, len]);
            this.strokeDashOffset(0);
            this.startAnimate(l).strokeDashOffset(-len);
        } else this.strokeDashArray([len, len]).strokeDashOffset(-len);
        return this;
    }
}