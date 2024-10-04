import { svg } from "@/Interact/RootSvg";

import { SDNode }               from "@/Node/SDNode";
import { GetterAndSetter } from "@/Node/Common";

import { toNode } from "@/Utility/Tool";

import { CenterFixAspect } from "@/Rule/Center";
import { IsTypeOfSDNode } from "@/Utility/Check";

export function BaseElement(parent) {
    SDNode.call(this, parent);

    this.newLayer("underBackground");
    this.newLayer("background");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 40);
    this.member.new("height", 40);
    this.member.new("rate", 1.2);
    this.member.new("value", undefined);

    this._.BASE_ELEMENT = true;

    return this;
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
            if (value) {
                value._.rule = rule;
            }
            this.member.flush("rate");
        }
    }
]

BaseElement.prototype.x             = GetterAndSetter("x", "setByEqual");
BaseElement.prototype.y             = GetterAndSetter("y", "setByEqual");
BaseElement.prototype.width         = GetterAndSetter("width", "setByEqual");
BaseElement.prototype.height        = GetterAndSetter("height", "setByEqual");
BaseElement.prototype.rate          = GetterAndSetter("rate", "setByDqual");
BaseElement.prototype.color         = backgroundGetterAndSetter("color");
BaseElement.prototype.fill          = backgroundGetterAndSetter("fill");
BaseElement.prototype.fillOpacity   = backgroundGetterAndSetter("fillOpacity");
BaseElement.prototype.stroke        = backgroundGetterAndSetter("stroke");
BaseElement.prototype.strokeOpacity = backgroundGetterAndSetter("strokeOpacity");
BaseElement.prototype.strokeWidth   = backgroundGetterAndSetter("strokeWidth");

BaseElement.prototype.text = function() {
    const value = this.child("value");
    if (!value) {
        return "";
    }
    return value.text();
}

BaseElement.prototype.drop = function() {
    const value = this.child("value");
    this.children.erase(value);
    value.attachTo(svg());
    return value;
}

BaseElement.prototype.value = function(value, rule) {
    if (arguments.length === 0) {
        return this.member.get("value");
    }
    rule = rule ? rule : CenterFixAspect(this.member.get("rate"));
    const valueIsSDNode = IsTypeOfSDNode(value);
    value = toNode(this, value);
    const oldValue = this.member.get("value");
    if (oldValue) {
        this.children.erase(oldValue);
        oldValue.opacity(0).remove();
    }
    if (value === undefined || value === null) {
        return this;
    }
    value._.enter = (element, move) => {
        if (!valueIsSDNode) {
            element.attachTo(this)
            element.opacity(0);
        } else {
            element.attachTo(this)
            element.after(this);
            element.opacity(0);
        }
        move();
        element.update();
        element.startAnimate(this);
        element.opacity(1);
    }
    this.children.push("value", value, rule);
    this.member.setAndFlush("value", value);
    this.tryUpdate();
    return this;
}

BaseElement.prototype.intValue = function() {
    const value = this.member.get("value");
    if (!value) return 0;
    return +value.text();
}

BaseElement.prototype.valueFromExist = function(value, rule) {
    rule = rule ? rule : CenterFixAspect(this.member.get("rate"));
    const oldValue = this.children.erase("value");
    if (oldValue) {
        oldValue.opacity(0).remove();
    }
    value._.enter = (node, move) => {
        node.startAnimate(this);
        node.attachTo(this);
        move();
        node.opacity(1);
    };
    this.children.push("value", value, rule);
    this.tryUpdate();
    return this;
}

BaseElement.prototype.valueRule = function(rule) {
    this.member.set("rule", rule);
    const value = this.member.get("value");
    if (value) {
        value._.rule = rule;
    }
}

function backgroundGetterAndSetter(key) {
    return function(value) {
        const background = this.child("background");
        if (value === undefined) {
            return background[key]();
        }
        background[key](value);
        return this;
    }
}
