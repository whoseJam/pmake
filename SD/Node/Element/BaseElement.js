import { svg } from "@/Interact/RootSvg";

import { SDNode } from "@/Node/SDNode";

import { CenterFixAspect } from "@/Rule/Center";

import { Cast }  from "@/Utility/Cast";
import { Check } from "@/Utility/Check";

export function BaseElement(parent) {
    SDNode.call(this, parent);
    
    this.newLayer("background");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 40);
    this.member.new("height", 40);
    this.member.new("rate", 1.2);
    this.member.new("value", undefined);

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
            if (value) {
                value._.rule = rule;
            }
            this.member.flush("rate");
        }
    }
]

BaseElement.prototype.x             = SDNode.OrdinaryGSet("x", "setByEqual");
BaseElement.prototype.y             = SDNode.OrdinaryGSet("y", "setByEqual");
BaseElement.prototype.width         = SDNode.OrdinaryGSet("width", "setByEqual");
BaseElement.prototype.height        = SDNode.OrdinaryGSet("height", "setByEqual");
BaseElement.prototype.rate          = SDNode.OrdinaryGSet("rate", "setByDqual");
BaseElement.prototype.color         = BackgroundGSet("color");
BaseElement.prototype.fill          = BackgroundGSet("fill");
BaseElement.prototype.fillOpacity   = BackgroundGSet("fillOpacity");
BaseElement.prototype.stroke        = BackgroundGSet("stroke");
BaseElement.prototype.strokeOpacity = BackgroundGSet("strokeOpacity");
BaseElement.prototype.strokeWidth   = BackgroundGSet("strokeWidth");

BaseElement.prototype.text = function() {
    const value = this.child("value");
    if (!value) {
        return "";
    }
    return value.text();
}

BaseElement.prototype.drop = function() {
    const value = this.child("value");
    this._.children.erase(value);
    value.attachTo(svg());
    return value;
}

BaseElement.prototype.value = function(value, rule) {
    if (arguments.length === 0) {
        return this.member.get("value");
    }
    rule = rule ? rule : CenterFixAspect(this.member.get("rate"));
    const valueIsSDNode = Check.isTypeOfSDNode(value);
    value = Cast.castToSDNode(this, value);
    const oldValue = this.member.get("value");
    if (oldValue) {
        this._.children.erase(oldValue);
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
    this._.children.push("value", value, rule);
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
    const oldValue = this._.children.erase("value");
    if (oldValue) {
        oldValue.opacity(0).remove();
    }
    value._.enter = (node, move) => {
        node.startAnimate(this);
        node.attachTo(this);
        move();
        node.opacity(1);
    };
    this._.children.push("value", value, rule);
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

function BackgroundGSet(key) {
    return function(value) {
        const background = this.child("background");
        if (value === undefined) {
            return background[key]();
        }
        background[key](value);
        return this;
    }
}
