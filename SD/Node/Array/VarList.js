import { Context } from "@/Animate/Context";
import { D3Layer } from "@/Node/D3Layer";
import { SDNode } from "@/Node/SDNode";
import { Text } from "@/Node/Nake/Text";
import { BaseArray } from "./BaseArray";
import { naiveGetterAndSetter } from "../Common";
import { Code } from "./Code";

export function VarList(parent) {
    BaseArray.call(this, parent);

    this.g().type("VarList");

    this.new("font-size", 25);
    this.new("dx", 40);

    return this;
}

VarList.prototype = { 
    ...BaseArray.prototype
};

VarList.prototype.fontSize = naiveGetterAndSetter("font-size", "setByEqual"); 

VarList.prototype.width  = Code.prototype.width;
VarList.prototype.height = Code.prototype.height;
VarList.prototype.updateList = [
    ...VarList.prototype.updateList,
    update
];

VarList.prototype.put = function(key, value) {
    const stringValue = value === Infinity ? "inf" : value;
    const elements = this._.elements;
    for (let element of elements) {
        if (element.key == key) {
            const context = new Context(this);
            element.startAnimate(context.tillc(0, 0.5));
            element.opacity(0).dx(this._.dx);
            element.value = value;
            element.text(`${key}=${stringValue}`);
            element.startAnimate(context.tillc(0.5, 1));
            element.opacity(1).dx(-this._.dx);
            element.startAnimate(this);
            return this;
        }
    }
    const element = new Text(this, `${key}=${stringValue}`);
    element.key = key;
    element.value = value;
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.startAnimate(this);
        element.opacity(1);
    }
    this.insertByArrayBase(this.end() + 1, element);
    this.tryUpdate();
    return this;
}

VarList.prototype.get = function(key) {
    const elements = this._.elements;
    for (let element of elements)
        if (element.key == key) return element.value;
    return undefined;
}

VarList.prototype.element = function(key) {
    const elements = this._.elements;
    for (let element of elements)
        if (element.key == key) return element;
    throw new Error("Value Not Found In VarList");
}

VarList.prototype.inc = function(key) {
    this.put(key, this.get(key) + 1);
    return this;
}

VarList.prototype.dec = function(key) {
    this.put(key, this.get(key) - 1);
    return this;
}

VarList.prototype.incBy = function(key, delta) {
    this.put(key, this.get(key) + delta);
    return this;
}

function update() {
    const x = this._.x;
    let y = this._.y;
    let width = 0;
    let height = 0;
    const elements = this._.elements;
    for (let element of elements) {
        const move = () => {
            element.fontSize(this._.fontSize);
            element.x(x).y(y);
        }
        if (element._.enter) {
            element._.enter(element, move);
            element._.enter = undefined;
        } else move();
        width = Math.max(width, element.width());
        height += element.height();
        y += element.height();
    }
    this._.width = width;
    this._.height = height;
}
