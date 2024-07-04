import { CenterFixAspect } from "@/Rule/Center";
import { D3Layer } from "@/Node/D3Layer";
import { SDNode } from "@/Node/SDNode";
import { toNode } from "@/Utility/Tool";
import { svg } from "@/Interact/Svg";
import { naiveGetterAndSetter } from "../Common";

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
}

BaseElement.prototype = {
    ...SDNode.prototype
};

BaseElement.prototype.x             = naiveGetterAndSetter("x", "setByEqual");
BaseElement.prototype.y             = naiveGetterAndSetter("y", "setByEqual");
BaseElement.prototype.width         = naiveGetterAndSetter("width", "setByEqual");
BaseElement.prototype.height        = naiveGetterAndSetter("height", "setByEqual");
BaseElement.prototype.rate          = naiveGetterAndSetter("rate", "setByDqual");
BaseElement.prototype.color         = backgroundGetterAndSetter("color");
BaseElement.prototype.fill          = backgroundGetterAndSetter("fill");
BaseElement.prototype.fillOpacity   = backgroundGetterAndSetter("fillOpacity");
BaseElement.prototype.stroke        = backgroundGetterAndSetter("stroke");
BaseElement.prototype.strokeOpacity = backgroundGetterAndSetter("strokeOpacity");
BaseElement.prototype.strokeWidth   = backgroundGetterAndSetter("strokeWidth");

BaseElement.prototype.drop = function() {
    const value = this.child("value");
    this.children.erase(value);
    value.attachTo(svg());
    return value;
}

/**
 * @overload
 * @param {SDNode} value 
 * @param {(parent: SDNode, child: SDNode) => void} rule 
 * @returns {this}
 * @overload
 * @param {SDNode} value
 * @returns {this}
 * @overload
 * @returns {SDNode}
 */
BaseElement.prototype.value = function(value, rule) {
    if (value === undefined) {
        return this.member.get("value");
    }
    rule = rule ? rule : CenterFixAspect(this.member.get("rate"));
    value = toNode(this, value);
    const ovalue = this.children.erase("value");
    if (ovalue) ovalue.opacity(0).remove();
    if (!value) return this;
    value._.enter = (node, move) => {
        node.attachTo(this);
        node.after(this);
        node.opacity(0);
        move();
        node.unfreeze();
        node.freeze();
        node.startAnimate(this);
        node.opacity(1);
    };
    this.children.push("value", value, rule);
    this.tryUpdate();
    return this;
}

/**
 * @returns {number}
 */
BaseElement.prototype.intValue = function() {
    const value = this.child("value");
    if (!value) return 0;
    if ("text" in value) return +value.text();
    throw new Error("Mismatch Function");
}

/**
 * @overload
 * @param {SDNode} value 
 * @param {(parent: SDNode, child: SDNode) => void} rule 
 * @returns {this}
 * @overload
 * @param {SDNode} value
 * @returns {this}
 */
BaseElement.prototype.valueFromExist = function(value, rule) {
    rule = rule ? rule : CenterFixAspect(this._.rate);
    const ovalue = this.children.erase("value");
    if (ovalue) ovalue.startAnimate(this).opacity(0).remove();
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
