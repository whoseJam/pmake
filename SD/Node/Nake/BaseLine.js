import { Action } from "@/Animate/Action";
import { BaseNake } from "./BaseNake";
import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";
import { naiveUpdate } from "../Common";
import { PointAtPathByRate } from "@/Rule/Path";
import { toNode } from "@/Utility/Tool";

export function BaseLine(parent, tag) {
    BaseNake.call(this, parent, tag);

    this.member.set("fill-opacity", 0);
    this.member.set("stroke-opacity", 1);
    this.member.set("stroke-width", 1);
    this.member.set("stroke", "#000000");
    this.member.new("marker-start", "");
    this.member.new("marker-mid", "");
    this.member.new("marker-end", "");
    this.member.new("value", undefined);
    this.member.new("rule", undefined);

    const nake = this._.nake;
    nake.setAttribute("fill-opacity", this.member.get("fill-opacity"));
    nake.setAttribute("stroke-opacity", this.member.get("stroke-opacity"));
    nake.setAttribute("stroke-width", this.member.get("stroke-width"));
    nake.setAttribute("stroke", this.member.get("stroke"));
}

BaseLine.prototype = {
    ...BaseNake.prototype
};

BaseLine.prototype.markerStart = markerGetterAndSetter("marker-start");
BaseLine.prototype.markerMid   = markerGetterAndSetter("marker-mid");
BaseLine.prototype.markerEnd   = markerGetterAndSetter("marker-end");
BaseLine.prototype.updateList = [
    ...BaseLine.prototype.updateList,
    naiveUpdate("marker-start", Interp.stringInterp),
    naiveUpdate("marker-mid", Interp.stringInterp),
    naiveUpdate("marker-end", Interp.stringInterp)
];

function markerGetterAndSetter(key) {
    return function(marker) {
        if (marker === undefined) {
            return this.member.get(key);
        }
        marker = (marker !== "") ? `url(#${marker})` : "";
        this.member.set(key, marker);
        this.tryUpdate();
        return this;
    }
}

BaseLine.prototype.arrow = function(flag = true) {
    if (flag) {
        this.markerEnd("arrow");
    } else {
        this.markerEnd("");
    }
    return this;
}

BaseLine.prototype.revArrow = function(flag = true) {
    if (flag) {
        this.markerStart("arrowReverse");
    } else {
        this.markerStart("");
    }
    return this;
}

BaseLine.prototype.doubleArrow = function(flag = true) {
    this.arrow(flag);
    this.revArrow(flag);
}

BaseLine.prototype.pointStoT = function() {
    let len = this.totalLength();
    let context = new Context(this);
    context.till(0, 0);
    this.strokeDashArray([0, len]);
    context.till(0, 1);
    this.strokeDashArray([len, 0]);
    context.recover();
    return this;
}

BaseLine.prototype.pointTtoS = function() {
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

BaseLine.prototype.fadeStoT = function() {
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

BaseLine.prototype.fadeTtoS = function() {
    let len = this.totalLength();
    let context = new Context(this);
    context.till(0, 0);
    this.strokeDashArray([len, 0]);
    context.till(0, 1);
    this.strokeDashArray([0, len]);
    context.recover();
    return this;
}

BaseLine.prototype.source = function(x, y) {
    if (arguments.length === 0) {
        return [this.x1(), this.y1()];
    } else if (arguments.length === 1) {
        const point = arguments[0];
        return this.source(point[0], point[1]);
    }
    this.x1(x).y1(y);
    return this;
}

BaseLine.prototype.target = function(x, y) {
    if (arguments.length === 0) {
        return [this.x2(), this.y2()];
    } else if (arguments.length === 1) {
        const point = arguments[0];
        return this.target(point[0], point[1]);
    }
    this.x2(x).y2(y);
    return this;
}

BaseLine.prototype.x = function(x) {
    const x1 = this.x1();
    const x2 = this.x2();
    const ox = Math.min(x1, x2);
    if (x === undefined) {
        return ox;
    }
    const dx = x - ox;
    this.x1(x1 + dx).x2(x2 + dx);
    return this;
}

BaseLine.prototype.y = function(y) {
    const y1 = this.y1();
    const y2 = this.y2();
    const oy = Math.min(y1, y2);
    if (y === undefined) {
        return oy;
    }
    const dy = y - oy;
    this.y1(y1 + dy).y2(y2 + dy);
    return this;
}

BaseLine.prototype.width = function(width) {
    const x1 = this.x1();
    const x2 = this.x2();
    if (width === undefined) {
        return Math.abs(x1 - x2);
    }
    if (x1 < x2) {
        this.x2(x1 + width);
    } else {
        this.x1(x2 + width);
    }
    return this;
}

BaseLine.prototype.height = function(height) {
    const y1 = this.y1();
    const y2 = this.y2();
    if (height === undefined) {
        return Math.abs(y1 - y2);
    }
    if (y1 < y2) {
        this.y2(y1 + height);
    } else {
        this.y1(y2 + height);
    }
    return this;
}

BaseLine.prototype.value = function(value, rule) {
    const oldValue = this.child("value");
    if (value === undefined) {
        return oldValue;
    }
    rule = rule ? rule : 
           this.member.get("rule") ? this.member.get("rule") : PointAtPathByRate(0.5, "cx", "cy");
    value = toNode(this, value);

    if (oldValue) {
        oldValue.opacity(0).remove();
    }
    if (!value) {
        return this;
    }
    value._.enter = (element, move) => {
        element.attachTo(this);
        element.after(this);
        element.opacity(0);
        move();
        element.unfreeze().freeze();
        element.startAnimate(this);
        element.opacity(1);
    };
    this.children.push("value", value, rule);
    this.tryUpdate();
    return this;
}

BaseLine.prototype.rule = function(rule) {
    const value = this.child("value");
    this.member.setAndFlush("rule", rule);
    if (value) {
        value._.rule = rule;
        this.tryUpdate();
    }
}

BaseLine.prototype.intValue = function() {
    const value = this.child("value");
    if (!value) {
        return 0;
    }
    return +value.text();
}