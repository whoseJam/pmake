import { SDNode } from "@/Node/SDNode";
import { Enter as EN } from "@/Node/SDNode/Enter";
import { Exit as EX } from "@/Node/SDNode/Exit";
import { CenterFixAspect } from "@/Rule/Center";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export function BaseElement(parent) {
    SDNode.call(this, parent);

    this.newLayer("background");

    this.vars.merge({
        x: 0,
        y: 0,
        width: 40,
        height: 40,
        rate: 1.2,
        background: undefined,
        value: undefined,
    });

    this._.BASE_ELEMENT = true;
}

BaseElement.prototype = {
    ...SDNode.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    rate: Factory.handlerLowPrecise("rate"),
    color: backgroundHandler("color"),
    fill: backgroundHandler("fill"),
    fillOpacity: backgroundHandler("fillOpacity"),
    stroke: backgroundHandler("stroke"),
    strokeOpacity: backgroundHandler("strokeOpacity"),
    strokeWidth: backgroundHandler("strokeWidth"),
    background: function () {
        return this.vars.background;
    },
    text: function () {
        const value = this.child("value");
        if (!value) return "";
        if (!value.text) ErrorLauncher.invalidInvoke("text");
        return value.text();
    },
    drop: function () {
        const value = this.child("value");
        value.onExit(EX.drop());
        this.eraseChild(value);
        return value;
    },
    intValue: function () {
        const value = this.value();
        if (!value) return 0;
        if (!value.text) ErrorLauncher.invalidInvoke("intValue");
        return +value.text();
    },
    value: function (value, rule) {
        if (arguments.length === 0) return this.child("value");
        if (this.hasChild("value")) this.eraseChild("value");
        if (Check.isFalseType(value)) return this;
        rule = getValueRule(this.vars, rule);
        value = Cast.castToSDNode(this, value);
        value.onEnterDefault(EN.appear());
        value.onExitDefault(EX.fade());
        value.triggerEnter(this, () => this.childAs("value", value, rule));
        return this;
    },
    valueFromExist: function (value, rule) {
        if (this.hasChild("value")) this.eraseChild("value");
        rule = getValueRule(this.vars, rule);
        value.onEnter(EN.moveTo());
        value.onExitDefault(EX.fade());
        value.triggerEnter(this, () => this.childAs("value", value, rule));
        return this;
    },
};

function backgroundHandler(key) {
    return function (value) {
        const background = this.child("background");
        if (value === undefined) return background[key]();
        background[key](value);
        return this;
    };
}

function getValueRule(vars, rule) {
    return rule ? rule : CenterFixAspect(vars.rate);
}
