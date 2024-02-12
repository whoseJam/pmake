import { LinkBase } from "../Basic/LinkBase";
import { Path } from "../Basic/Path";
import { Node } from "../Node";

/**
 * @class CurveBase
 * @description 曲线类的基类，一个曲线类主要由起点和终点固定轨迹，不同的曲线有不同的附加参数来精细化控制曲线。 \
 * 每个曲线子类应该实现一个pathCalculator函数，用来计算该类内部curve对象的d属性，每当x1,x2,y1,y2其中之一被修改过后，
 * 或者曲线的附加参数被修改过后，都应该重新调用pathCalculator，并对curve对象的d属性进行重设。
 */
export class CurveBase extends Node {
    constructor(node) {
        super(node);
        let curve = new Path(this);
        this._.x1 = 0;
        this._.y1 = 0;
        this._.x2 = 40;
        this._.y2 = 40;
        this._.pathCalculator = function() { return ""; }
        this.children.push("curve", curve);
    }

    fill() {
        return this.dispatch("curve", "fill", arguments);
    }

    fillOpacity() {
        return this.dispatch("curve", "fillOpacity", arguments);
    }

    stroke() {
        return this.dispatch("curve", "stroke", arguments);
    }

    strokeOpacity() {
        return this.dispatch("curve", "strokeOpacity", arguments);
    }

    strokeWidth() {
        return this.dispatch("curve", "strokeWidth", arguments);
    }

    opacity() {
        return this.dispatch("curve", "opacity", arguments);
    }

    color() {
        return this.dispatch("curve", "color", arguments);
    }

    source(x, y) {
        if (x === undefined)
            return [this.x1(), this.y1()];
        if (typeof(x) !== "number")
            return this.source(x[0], x[1]);
        this.x1(x).y1(y);
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

    at() {
        return this.dispatch("curve", "at", arguments);
    }

    getPointAtLength() {
        return this.dispatch("curve", "getPointAtLength", arguments);
    }

    totalLength() {
        return this.dispatch("curve", "totalLength", arguments);
    }

    markerStart() {
        return this.dispatch("curve", "markerStart", arguments);
    }

    markerMid() {
        return this.dispatch("curve", "markerMid", arguments);
    }

    markerEnd() {
        return this.dispatch("curve", "markerEnd", arguments);
    }

    arrow() {
        return this.dispatch("curve", "arrow", arguments);
    }

    doubleArrow() {
        return this.dispatch("curve", "doubleArrow", arguments);
    }

    x() {
        return this.dispatch("curve", "x", arguments);
    }

    y() {
        return this.dispatch("curve", "y", arguments);
    }

    x1(x) {
        if (x === undefined)
            return this._.x1;
        this._.x1 = x;
        this.update();
        return this;
    }

    y1(y) {
        if (y === undefined)
            return this._.y1;
        this._.y1 = y;
        this.update();
        return this;
    }

    x2(x) {
        if (x === undefined)
            return this._.x2;
        this._.x2 = x;
        this.update();
        return this;
    }

    y2(y) {
        if (y === undefined)
            return this._.y2;
        this._.y2 = y;
        this.update();
        return this;
    }

    update() {
        let curve = this.children.child("curve");
        curve.d(this._.pathCalculator.call(this));
        super.update();
    }
}
