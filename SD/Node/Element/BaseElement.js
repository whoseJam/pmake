import { Enter as EN } from "@/Node/Core/Enter";
import { Exit as EX } from "@/Node/Core/Exit";
import { SD2DNode } from "@/Node/SD2DNode";
import { Rule as R } from "@/Rule/Rule";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export class BaseElement extends SD2DNode {
    constructor(target) {
        super(target);

        this.vars.merge({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            rate: 1.3,
            value: null,
        });
    }
}

Object.assign(BaseElement.prototype, {
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        Check.validateNumber(x, `${this.constructor.name}.x`);
        this.vars.lpset("x", x);
        return this;
    },
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        Check.validateNumber(y, `${this.constructor.name}.y`);
        this.vars.lpset("y", y);
        return this;
    },
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        Check.validateNumber(width, `${this.constructor.name}.width`);
        this.vars.lpset("width", width);
        return this;
    },
    height(height) {
        if (arguments.length === 0) return this.vars.height;
        Check.validateNumber(height, `${this.constructor.name}.height`);
        this.vars.lpset("height", height);
        return this;
    },
    rate(rate) {
        if (arguments.length === 0) return this.vars.rate;
        Check.validateNumber(rate, `${this.constructor.name}.rate`);
        this.vars.mpset("rate", rate);
        return this;
    },
    color: backgroundHandler("color"),
    fill: backgroundHandler("fill"),
    fillOpacity: backgroundHandler("fillOpacity"),
    stroke: backgroundHandler("stroke"),
    strokeOpacity: backgroundHandler("strokeOpacity"),
    strokeWidth: backgroundHandler("strokeWidth"),
    strokeDashOffset: backgroundHandler("strokeDashOffset"),
    strokeDashArray: backgroundHandler("strokeDashArray"),
    background() {
        return this.child("background");
    },
    text(text) {
        const value = this.child("value");
        if (arguments.length === 0) {
            if (!value) return "";
            if (!value.text) ErrorLauncher.methodNotFound(value, "text");
            return value.text();
        } else {
            if (!value) return this.value(text);
            if (!value.text) ErrorLauncher.methodNotFound(value, "text");
            value.text(text);
            return this;
        }
    },
    intValue() {
        const value = this.value();
        if (!value) return 0;
        if (!value.text) ErrorLauncher.methodNotFound(value, "text");
        const i = Math.floor(+value.text());
        if (isNaN(i)) ErrorLauncher.failToParseAsIntValue(value.text());
        return i;
    },
    value(value, rule) {
        if (arguments.length === 0) return this.child("value");
        if (this.hasChild("value")) this.eraseChild("value");
        if (Check.isEmpty(value)) return this;
        value = Cast.castToSDNode(this, value);
        this.childAs("value", value, rule || valueRule);
        return this;
    },
    valueFromExist(value, rule) {
        if (this.hasChild("value")) this.eraseChild("value");
        value.onEnter(EN.moveTo());
        this.childAs("value", value, rule || valueRule);
        return this;
    },
    drop() {
        const value = this.value();
        if (!value) return undefined;
        value.onExit(EX.drop());
        this.eraseChild(value);
        return value;
    },
});

function backgroundHandler(key) {
    return function (value) {
        const background = this.child("background");
        if (arguments.length === 0) return background[key]();
        background[key](value);
        return this;
    };
}

function valueRule(parent, child) {
    const rate = parent.rate();
    R.centerFixAspect(rate)(parent, child);
}
