import { Action } from "../../Animate/Action";
import { Base } from "./Base";
import { Context } from "../../Animate/Context";
import { Interp } from "../../Animate/Interp";
import { SDHelper } from "../../Utility/SDHelper";
import { PointAtPathByRate } from "../../Rule/Path";
import { toNode } from "../../Utility/Tool";

export class LinkBase extends Base {
    constructor(node, type) {
        super(node, type);
        this.fillOpacity(0);
    }
    
    // --------------------位置函数--------------------
    source(x, y) {
        if (arguments.length === 0) return [this.x1(), this.y1()];
        else if (arguments.length === 1) {
            let point = arguments[0];
            this.source(point[0], point[1]);
        }
        this.x1(x).y1(y);
        return this;
    }
    target(x, y) {
        if (arguments.length === 0) return [this.x2(), this.y2()];
        else if (arguments.length === 1) {
            let point = arguments[0];
            this.target(point[0], point[1]);
        }
        this.x2(x).y2(y);
        return this;
    }
    x(x) {
        let x1 = this.x1();
        let x2 = this.x2();
        let ox = Math.min(x1, x2);
        if (x === undefined) return ox;
        let dx = x - ox;
        this.x1(x1 + dx);
        this.x2(x2 + dx);
        return this;
    }
    y(y) {
        let y1 = this.y1();
        let y2 = this.y2();
        let oy = Math.min(y1, y2);
        if (y === undefined) return oy;
        let dy = y - oy;
        this.y1(y1 + dy);
        this.y2(y2 + dy);
        return this;
    }
    width(width) {
        this.dirtyCheck();
        if (width === undefined) return Math.abs(this._.x1 - this._.x2);
        let x1 = this._.x1;
        let x2 = this._.x2;
        if (x1 < x2) this.x2(x1 + width);
        else this.x1(x2 + width);
        return this;
    }
    height(height) {
        this.dirtyCheck();
        if (height === undefined) return Math.abs(this._.y1 - this._.y2);
        let y1 = this._.y1;
        let y2 = this._.y2;
        if (y1 < y2) this.y2(y1 + height);
        else this.y1(y2 + height);
        return this;
    }

    value(value, rule) {
        if (value === undefined) return this.child("value");
        value = toNode(this, value);
        let ovalue = this.children.erase("value");
        if (ovalue) ovalue.opacity(0).remove();
        if (!value) return this;
        this.childAs("value", value, rule ? rule : PointAtPathByRate(0.5));
        value.opacity(0).startAnimate(this).opacity(1);
        return this;
    }

    // --------------------线上标记--------------------
    markerStart(mark) {
        if (mark === undefined) return this._.markerStart;
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
        if (mark === undefined) return this._.markerMid;
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
        if (mark === undefined) return this._.markerEnd;
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
    /**
     * 给Link类元素添加末端箭头 
     * 
     * - arrow() 添加箭头
     * 
     * - arrow(true) 添加箭头
     * 
     * - arrow(null/false/undefined) 取消箭头
     * 
     */
    arrow(status = true) {
        if (status) this.markerEnd("arrow");
        else this.markerEnd(null);
        return this;
    }
    revArrow(status = true) {
        if (status) this.markerStart("arrowReverse");
        else this.markerStart(null);
        return this;
    }
    doubleArrow(status = true) {
        this.arrow(status);
        this.revArrow(status);
        return this;
    }

    // --------------------渐入渐出--------------------
    pointStoT() {
        let len = this.totalLength();
        let context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([0, len]);
        context.till(0, 1);
        this.strokeDashArray([len, 0]);
        context.recover();
        return this;
    }
    pointTtoS() {
        let len = this.totalLength();
        let context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(-len);
        context.till(0, 1);
        this.strokeDashOffset(0);
        context.recover();
        return this;
    }
    fadeStoT() {
        let len = this.totalLength();
        let context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(0);
        context.till(0, 1);
        this.strokeDashOffset(-len);
        context.recover();
        return this;
    }
    fadeTtoS() {
        let len = this.totalLength();
        let context = new Context(this);
        context.till(0, 0);
        this.strokeDashArray([len, 0]);
        context.till(0, 1);
        this.strokeDashArray([0, len]);
        context.recover();
        return this;
    }
}