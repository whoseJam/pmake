import { Rect }            from "@/Node/Nake/Rect";
import { Array }           from "@/Node/Array/Array";
import { Enter }           from "@/Node/SDNode/Enter";
import { BaseArray }       from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";

export function BarArray(parent) {
    BaseArray.call(this, parent);

    this.type("BarArray");
    this.newLayer("elements");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("elementWidth", 40);
    this.member.new("elementHeight", 40);
    this.member.new("height", 0);
}
    
BarArray.prototype = {
    ...BaseArray.prototype
};

BarArray.prototype.elementWidth  = SDNode.OrdinaryGSet("elementWidth", "setByEqual");
BarArray.prototype.elementHeight = SDNode.OrdinaryGSet("elementHeight", "setByEqual");
BarArray.prototype.updateList = [
    ...BarArray.prototype.updateList,
    update
];

BarArray.prototype.intValue = function(idx) {
    return this.value(idx);
}

BarArray.prototype.width = Array.prototype.width;
BarArray.prototype.height = function(height) {
    if (height === undefined) {
        return this.member.get("height");
    }
    const elements = this.member.get("elements");
    let maxValue = 1;
    for (let element of elements) {
        maxValue = Math.max(maxValue, element.value());
    }
    this.elementHeight(height / maxValue);
    return this;
}

BarArray.prototype.insert = function(index, value) {
    value = +value;
    if (typeof(value) !== "number") throw new Error("Invalid Arguments");
    const element = new Rect(this.layer("elements"));
    element.member.new("barArrayValue", value);
    element.value = function(value) {
        if (value === undefined) return this.member.get("barArrayValue");
        this.member.setAndFlush("barArrayValue", value);
        const baseline = this.my();
        this.height(value * this.parent.elementHeight());
        this.my(baseline);
        return this;
    }
    element.intValue = function() {
        return this.value();
    }

    element.onEnter(Enter.ordinary(this, "elements"));
    this.insertByBaseArray(index, element);
    return this;
}

function update() {
    if (this.member.hasChanged("x") ||
        this.member.hasChanged("y") ||
        this.member.hasChanged("elementWidth") ||
        this.member.hasChanged("elementHeight") ||
        this.member.hasChanged("elements")) {
        let x = this.x();
        const y = this.my();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this.member.get("elements");
        let maxHeight = 0;
        for (let element of elements) {
            const height = element.value() * elementHeight;
            this.tryMove(element, () => {
                element.width(elementWidth);
                element.height(height);
                element.x(x).my(y);
            })
            maxHeight = Math.max(maxHeight, height);
            x += elementWidth;
        }
        this.member.setAndFlush("height", maxHeight);
        this.member.setAndFlush("y", y - maxHeight);
        this.member.flush("x");
        this.member.flush("elementWidth");
        this.member.flush("elementHeight");
        this.member.flush("elements");
    }
}
