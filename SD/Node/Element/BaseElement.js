import { Exit }   from "@/Node/SDNode/Exit";
import { Enter }  from "@/Node/SDNode/Enter";
import { SDNode } from "@/Node/SDNode";

import { CenterFixAspect } from "@/Rule/Center";

import { Cast }          from "@/Utility/Cast";
import { Check }         from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export function BaseElement(parent) {
    SDNode.call(this, parent);
    
    this.newLayer("background");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 40);
    this.member.new("height", 40);
    this.member.new("rate", 1.2);

    this._.BASE_ELEMENT = true;
}

BaseElement.prototype = {
    ...SDNode.prototype
};

BaseElement.prototype.updateList = [
    ...BaseElement.prototype.updateList,
    function() {
        if (this.member.hasChanged("rate")) {
            const rule = CenterFixAspect(this.member.get("rate"));
            const value = this.child("value");
            value?.rule(rule);
            this.member.flush("rate");
        }
    }
]

BaseElement.prototype.x             = SDNode.ordinaryGetterAndSetter("x", "setByEqual");
BaseElement.prototype.y             = SDNode.ordinaryGetterAndSetter("y", "setByEqual");
BaseElement.prototype.width         = SDNode.ordinaryGetterAndSetter("width", "setByEqual");
BaseElement.prototype.height        = SDNode.ordinaryGetterAndSetter("height", "setByEqual");
BaseElement.prototype.rate          = SDNode.ordinaryGetterAndSetter("rate", "setByDqual");
BaseElement.prototype.color         = BackgroundGSet("color");
BaseElement.prototype.fill          = BackgroundGSet("fill");
BaseElement.prototype.fillOpacity   = BackgroundGSet("fillOpacity");
BaseElement.prototype.stroke        = BackgroundGSet("stroke");
BaseElement.prototype.strokeOpacity = BackgroundGSet("strokeOpacity");
BaseElement.prototype.strokeWidth   = BackgroundGSet("strokeWidth");

BaseElement.prototype.background = function() {
    return this.child("background");
}

BaseElement.prototype.text = function() {
    const value = this.child("value");
    if (!value) return "";
    if (!value.text) return "";
    return value.text();
}

BaseElement.prototype.drop = function() {
    const value = this.child("value");
    value.onExit(Exit.drop());
    this.eraseChild(value);
    return value;
}

BaseElement.prototype.intValue = function() {
    const value = this.value();
    if (!value) return 0;
    if (!value.text) ErrorLauncher.invalidInvoke("intValue");
    return +value.text();
}

BaseElement.prototype.value = function(value, rule) {
    if (arguments.length === 0) return this.child("value");
    if (this.hasChild("value")) this.eraseChild("value");
    if (Check.isFalseType(value)) return this;
    rule = GetValueRule.call(this, rule);
    value = Cast.castToSDNode(this, value);
    if (!value.onEnter()) value.onEnter(Enter.appear());
    if (!value.onExit()) value.onExit(Exit.fade());
    this.childAs("value", value, rule);
    return this;
}

BaseElement.prototype.valueFromExist = function(value, rule) {
    if (this.hasChild("value")) this.eraseChild("value");
    rule = GetValueRule.call(this, rule);
    value.onEnter(Enter.moveTo());
    if (!value.onExit()) value.onExit(Exit.fade());
    this.childAs("value", value, rule);
    return this;
}

function BackgroundGSet(key) {
    return function(value) {
        const background = this.child("background");
        if (value === undefined) return background[key]();
        background[key](value);
        return this;
    }
}

function GetValueRule(rule) {
    return rule ? rule : CenterFixAspect(this.member.get("rate"));
}
