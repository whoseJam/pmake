import { Context } from "@/Animate/Context";

import { Text }      from "@/Node/Nake/Text";
import { Code }      from "@/Node/Array/Code";
import { Enter }     from "@/Node/SDNode/Enter";
import { SDNode }    from "@/Node/SDNode";
import { BaseArray } from "@/Node/Array/BaseArray";

export function VarList(parent) {
    BaseArray.call(this, parent);

    this.type("VarList");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 0);
    this.member.new("height", 0);
    this.member.new("font-size", 25);
    this.member.new("dx", 40);
}

VarList.prototype = { 
    ...BaseArray.prototype
};

VarList.prototype.fontSize = SDNode.OrdinaryGSet("font-size", "setByEqual"); 

VarList.prototype.width  = Code.prototype.width;
VarList.prototype.height = Code.prototype.height;
VarList.prototype.updateList = [
    ...VarList.prototype.updateList,
    update
];

VarList.prototype.put = function(key, value) {
    const stringValue = value === Infinity ? "inf" : value;
    const elements = this.member.get("elements");
    for (let element of elements) {
        if (element.key == key) {
            const context = new Context(this);
            element.startAnimate(context.tillc(0, 0.5));
            element.opacity(0).dx(this.member.get("dx"));
            element.value = value;
            element.text(`${key}=${stringValue}`);
            element.startAnimate(context.tillc(0.5, 1));
            element.opacity(1).dx(-this.member.get("dx"));
            element.startAnimate(this);
            return this;
        }
    }
    const element = new Text(this, `${key}=${stringValue}`);
    element.key = key;
    element.value = value;
    element.onEnter(Enter.ordinary(this));
    this.insertByBaseArray(this.end() + 1, element);
    return this;
}

VarList.prototype.get = function(key) {
    const elements = this.member.get("elements");
    for (let element of elements)
        if (element.key == key) return element.value;
    return undefined;
}

VarList.prototype.element = function(key) {
    const elements = this.member.get("elements");
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
    if (this.member.hasChanged("x") ||
        this.member.hasChanged("y") ||
        this.member.hasChanged("font-size") ||
        this.member.hasChanged("elements")) {
        const x = this.member.get("x");
        let y = this.member.get("y");
        let width = 0;
        let height = 0;
        const fontSize = this.member.get("font-size");
        const elements = this.member.get("elements");
        for (let element of elements) {
            this.tryMove(element, () => {
                element.fontSize(fontSize);
                element.x(x).y(y);
            });
            width = Math.max(width, element.width());
            height += element.height();
            y += element.height();
        }
        this.member.setAndFlush("width", width);
        this.member.setAndFlush("height", height);
    }
}
