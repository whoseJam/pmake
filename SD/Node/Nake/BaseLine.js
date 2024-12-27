import { Interp }  from "@/Animate/Interp";
import { Context } from "@/Animate/Context";

import { SDNode }   from "@/Node/SDNode";
import { BaseNake } from "@/Node/Nake/BaseNake";

import { PointAtPathByRate } from "@/Rule/Path";

import { Cast }       from "@/Utility/Cast";
import { Color as C } from "@/Utility/Color";
import { reactive } from "../SDNode/SDValue";
import { Factory } from "@/Utility/Factory";
import { Enter as EN } from "@/Node/SDNode/Enter";
import { effect } from "../SDNode/SDValue";

export function BaseLine(parent, tag) {
    BaseNake.call(this, parent, tag);

    this.vars.fillOpacity = 0;
    this.vars.strokeOpacity = 1;
    this.vars.strokeWidth = 1;
    this.vars.stroke = C.black;
    this.vars.merge(reactive({
        markerStart: "",
        markerMid: "",
        markerEnd: "",
        value: undefined
    }));

    this.vars.associate("markerStart", Factory.action(this, this._.nake, "marker-start", Interp.stringInterp));
    this.vars.associate("markerMid", Factory.action(this, this._.nake, "marker-mid", Interp.stringInterp));
    this.vars.associate("markerEnd", Factory.action(this, this._.nake, "marker-end", Interp.stringInterp));
    
    this._.BASE_LINE = true;
}

BaseLine.prototype = {
    ...BaseNake.prototype
};

BaseLine.prototype.markerStart = HandlerMarker("markerStart");
BaseLine.prototype.markerMid = HandlerMarker("markerMid");
BaseLine.prototype.markerEnd = HandlerMarker("markerEnd");

function HandlerMarker(key) {
    return function(marker) {
        if (marker === undefined) return this.vars[key];
        marker = (marker !== "") ? `url(#${marker})` : "";
        this.vars[key] = marker;
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
    // rule = rule ? rule : 
    //        this.member.get("rule") ? this.member.get("rule") : PointAtPathByRate(0.5, "cx", "cy");
    value = Cast.castToSDNode(this, value);

    if (oldValue) {
        oldValue.opacity(0).remove();
    }
    if (!value) {
        return this;
    }
    value.onEnter(EN.appear());
    this.childAs("value", value);
    effect(() => {
        value.cx(this.cx());
        value.cy(this.cy());
    })
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