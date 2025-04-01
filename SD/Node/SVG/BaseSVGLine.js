import { Context } from "@/Animate/Context";
import { Interp } from "@/Animate/Interp";
import { Enter as EN } from "@/Node/Core/Enter";
import { Exit as EX } from "@/Node/Core/Exit";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { Rule as R } from "@/Rule/Rule";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export function BaseSVGLine(parent, tag) {
    BaseSVG.call(this, parent, tag);

    this.vars.merge({
        markerStart: "",
        markerMid: "",
        markerEnd: "",
        value: undefined,
    });

    this.vars.associate("markerStart", Factory.action(this, this._.nake, "marker-start", Interp.stringInterp));
    this.vars.associate("markerMid", Factory.action(this, this._.nake, "marker-mid", Interp.stringInterp));
    this.vars.associate("markerEnd", Factory.action(this, this._.nake, "marker-end", Interp.stringInterp));
}

BaseSVGLine.prototype = {
    ...BaseSVG.prototype,
    BASE_SVGLINE: true,
    markerStart: handlerMarker("markerStart"),
    markerMid: handlerMarker("markerMid"),
    markerEnd: handlerMarker("markerEnd"),
    arrow(arrow = true) {
        return this.markerEnd(arrow ? "arrow" : "");
    },
    revArrow(arrow = true) {
        return this.markerStart(arrow ? "reverseArrow" : "");
    },
    doubleArrow(arrow = true) {
        return this.arrow(arrow).revArrow(arrow);
    },
    pointStoT() {
        const len = this.totalLength();
        const context = new Context(this);
        this.startAnimate(context.tillc(0, 0));
        this.strokeDashArray([0, len]);
        this.startAnimate(context.tillc(0, 1));
        this.strokeDashArray([len, 0]);
        return this;
    },
    pointTtoS() {
        const len = this.totalLength();
        const context = new Context(this);
        this.startAnimate(context.tillc(0, 0));
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(-len);
        this.startAnimate(context.tillc(0, 1));
        this.strokeDashArray([len, 0]);
        this.strokeDashOffset(0);
        return this;
    },
    fadeStoT() {
        const len = this.totalLength();
        const context = new Context(this);
        this.startAnimate(context.tillc(0, 0));
        this.strokeDashArray([len, len]);
        this.strokeDashOffset(0);
        this.startAnimate(context.tillc(0, 1));
        this.strokeDashArray([0, len]);
        this.strokeDashOffset(-len);
        return this;
    },
    fadeTtoS() {
        const len = this.totalLength();
        const context = new Context(this);
        this.startAnimate(context.tillc(0, 0));
        this.strokeDashArray([len, 0]);
        this.startAnimate(context.tillc(0, 1));
        this.strokeDashArray([0, len]);
        return this;
    },
    at(k) {
        ErrorLauncher.notImplementedYet("at", this.type());
    },
    getPointAtLength(length) {
        ErrorLauncher.notImplementedYet("getPointAtLength", this.type());
    },
    totalLength() {
        ErrorLauncher.notImplementedYet("totalLength", this.type());
    },
    text() {
        const value = this.child("value");
        if (!value) return "";
        if (!value.text) ErrorLauncher.invalidInvoke("text");
        return value.text();
    },
    drop() {
        const value = this.child("value");
        value.onExit(EX.drop());
        this.eraseChild(value);
        return value;
    },
    intValue() {
        const value = this.value();
        if (!value) return 0;
        if (!value.text) ErrorLauncher.invalidInvoke("intValue");
        return +value.text();
    },
    value(value, rule) {
        if (arguments.length === 0) return this.child("value");
        if (this.hasChild("value")) this.eraseChild("value");
        if (Check.isFalseType(value)) return this;
        rule = getValueRule(this.vars, rule);
        value = Cast.castToSDNode(this, value);
        value.onEnterDefault(EN.appear());
        value.onExitDefault(EX.fade());
        this.childAs("value", value, rule);
        return this;
    },
};

function handlerMarker(key) {
    return function (marker) {
        if (marker === undefined) return this.vars[key];
        marker = marker !== "" ? `url(#${marker})` : "";
        this.vars[key] = marker;
        return this;
    };
}

function getValueRule(vars, rule) {
    return rule ? rule : R.pointAtPathByRate(0.5, "cx", "cy");
}
