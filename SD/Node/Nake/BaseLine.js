import { Interp }  from "@/Animate/Interp";
import { Context } from "@/Animate/Context";

import { SDNode }   from "@/Node/SDNode";
import { BaseNake } from "@/Node/Nake/BaseNake";

import { PointAtPathByRate } from "@/Rule/Path";

import { Cast } from "@/Utility/Cast";

export function BaseLine(parent, tag) {
    BaseNake.call(this, parent, tag);

    this.member.setAndFlush("fill-opacity", 0);
    this.member.setAndFlush("stroke-opacity", 1);
    this.member.setAndFlush("stroke-width", 1);
    this.member.setAndFlush("stroke", "#000000");
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

    this._.BASE_LINE = true;
}

BaseLine.prototype = {
    ...BaseNake.prototype
};

BaseLine.prototype.markerStart = MarkerGSet("marker-start");
BaseLine.prototype.markerMid   = MarkerGSet("marker-mid");
BaseLine.prototype.markerEnd   = MarkerGSet("marker-end");
BaseLine.prototype.updateList = [
    ...BaseLine.prototype.updateList,
    SDNode.OrdinaryUpdate("marker-start", Interp.stringInterp),
    SDNode.OrdinaryUpdate("marker-mid", Interp.stringInterp),
    SDNode.OrdinaryUpdate("marker-end", Interp.stringInterp)
];

function MarkerGSet(key) {
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
    this.markerEnd(flag ? "arrow" : "");
    return this;
}

BaseLine.prototype.revArrow = function(flag = true) {
    this.markerStart(flag ? "arrowReverse" : "");
    return this;
}

BaseLine.prototype.doubleArrow = function(flag = true) {
    this.arrow(flag);
    this.revArrow(flag);
    return this;
}

BaseLine.prototype.pointStoT = function() {
    const len = this.totalLength();
    const context = new Context(this);
    this.startAnimate(context.tillc(0, 0));
    this.strokeDashArray([0, len]);
    this.startAnimate(context.tillc(0, 1));
    this.strokeDashArray([len, 0]);
    return this;
}

BaseLine.prototype.pointTtoS = function() {
    const len = this.totalLength();
    const context = new Context(this);
    this.startAnimate(context.tillc(0, 0));
    this.strokeDashArray([len, len]);
    this.strokeDashOffset(-len);
    this.startAnimate(context.tillc(0, 1));
    this.strokeDashArray([len, 0]);
    this.strokeDashOffset(0);
    return this;
}

BaseLine.prototype.fadeStoT = function() {
    const len = this.totalLength();
    const context = new Context(this);
    this.startAnimate(context.tillc(0, 0));
    this.strokeDashArray([len, len]);
    this.strokeDashOffset(0);
    this.startAnimate(context.tillc(0, 1));
    this.strokeDashArray([0, len]);
    this.strokeDashOffset(-len);
    return this;
}

BaseLine.prototype.fadeTtoS = function() {
    const len = this.totalLength();
    const context = new Context(this);
    this.startAnimate(context.tillc(0, 0));
    this.strokeDashArray([len, 0]);
    this.startAnimate(context.tillc(0, 1));
    this.strokeDashArray([0, len]);
    return this;
}

BaseLine.prototype.source = function(x, y) {
    if (arguments.length === 0) {
        return [this.x1(), this.y1()];
    } else if (arguments.length === 1) {
        const point = arguments[0];
        return this.source(point[0], point[1]);
    }
    this.freeze().x1(x).y1(y).unfreeze();
    return this;
}

BaseLine.prototype.target = function(x, y) {
    if (arguments.length === 0) {
        return [this.x2(), this.y2()];
    } else if (arguments.length === 1) {
        const point = arguments[0];
        return this.target(point[0], point[1]);
    }
    this.freeze().x2(x).y2(y).unfreeze();
    return this;
}

BaseLine.prototype.x = function(x) {
    const x1 = this.x1();
    const x2 = this.x2();
    const ox = Math.min(x1, x2);
    if (x === undefined) return ox;
    const dx = x - ox;
    this.freeze().x1(x1 + dx).x2(x2 + dx).unfreeze();
    return this;
}

BaseLine.prototype.y = function(y) {
    const y1 = this.y1();
    const y2 = this.y2();
    const oy = Math.min(y1, y2);
    if (y === undefined) return oy;
    const dy = y - oy;
    this.freeze().y1(y1 + dy).y2(y2 + dy).unfreeze();
    return this;
}

BaseLine.prototype.width = function(width) {
    const x1 = this.x1();
    const x2 = this.x2();
    if (width === undefined) return Math.abs(x1 - x2);
    if (x1 < x2) this.x2(x1 + width);
    else this.x1(x2 + width);
    return this;
}

BaseLine.prototype.height = function(height) {
    const y1 = this.y1();
    const y2 = this.y2();
    if (height === undefined) return Math.abs(y1 - y2);
    if (y1 < y2) this.y2(y1 + height);
    else this.y1(y2 + height);
    return this;
}

BaseLine.prototype.value = function(value, rule) {
    const oldValue = this.child("value");
    if (value === undefined) {
        return oldValue;
    }
    rule = rule ? rule : 
           this.member.get("rule") ? this.member.get("rule") : PointAtPathByRate(0.5, "cx", "cy");
    value = Cast.castToSDNode(this, value);

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
        element.update();
        element.startAnimate(this);
        element.opacity(1);
    };
    this._.children.push("value", value, rule);
    this.tryUpdate();
    return this;
}

BaseLine.prototype.valueRule = function(rule) {
    const value = this.child("value");
    this.member.setAndFlush("rule", rule);
    if (value) {
        value._.rule = rule;
        this.tryUpdate();
    }
}

BaseLine.prototype.intValue = function() {
    const value = this.child("value");
    return !value ? 0 : +value.text();
}