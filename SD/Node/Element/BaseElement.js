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
        value: undefined
    });

    this._.BASE_ELEMENT = true;
}

BaseElement.prototype = {
    ...SDNode.prototype
};

BaseElement.prototype.x = function (x) {
    if (x === undefined) return this.vars.x;
    console.log("set element x=", x);
    this.vars.x = x;
    return this;
}
BaseElement.prototype.y = Factory.handlerLowPrecise("y");
BaseElement.prototype.width = Factory.handlerLowPrecise("width");
BaseElement.prototype.height = Factory.handlerLowPrecise("height");
BaseElement.prototype.rate = Factory.handlerLowPrecise("rate");
BaseElement.prototype.color = BackgroundHandler("color");
BaseElement.prototype.fill = BackgroundHandler("fill");
BaseElement.prototype.fillOpacity = BackgroundHandler("fillOpacity");
BaseElement.prototype.stroke = BackgroundHandler("stroke");
BaseElement.prototype.strokeOpacity = BackgroundHandler("strokeOpacity");
BaseElement.prototype.strokeWidth = BackgroundHandler("strokeWidth");

BaseElement.prototype.background = function () {
    return this.vars.background;
}

BaseElement.prototype.text = function () {
    const value = this.child("value");
    if (!value) return "";
    if (!value.text) return ErrorLauncher.invalidInvoke("text");
    return value.text();
}

BaseElement.prototype.drop = function () {
    const value = this.child("value");
    value.onExit(EX.drop());
    this.eraseChild(value);
    return value;
}

BaseElement.prototype.intValue = function () {
    const value = this.value();
    if (!value) return 0;
    if (!value.text) ErrorLauncher.invalidInvoke("intValue");
    return +value.text();
}

BaseElement.prototype.value = function (value, rule) {
    if (arguments.length === 0) return this.child("value");
    if (this.hasChild("value")) this.eraseChild("value");
    if (Check.isFalseType(value)) return this;
    rule = GetValueRule(this.vars, rule);
    value = Cast.castToSDNode(this, value);
    value.onEnterDefault(EN.appear());
    value.onExitDefault(EX.fade());
    value.triggerEnter(this, () => this.childAs("value", value, rule));
    return this;
}

BaseElement.prototype.valueFromExist = function (value, rule) {
    if (this.hasChild("value")) this.eraseChild("value");
    rule = GetValueRule(this.vars, rule);
    value.onEnter(EN.moveTo());
    value.onExitDefault(EX.fade());
    value.triggerEnter(this, () => this.childAs("value", value, rule));
    return this;
}

function BackgroundHandler(key) {
    return function (value) {
        const background = this.child("background");
        if (value === undefined) return background[key]();
        background[key](value);
        return this;
    }
}

function GetValueRule(vars, rule) {
    return rule ? rule : CenterFixAspect(vars.rate);
}
