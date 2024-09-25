import { Rect } from "@/Node/Nake/Rect";
import { BaseArray } from "./BaseArray";
import { GetterAndSetter } from "../Common";

export function BarArray(parent) {
    BaseArray.call(this, parent);

    this.g().type("BarArray");
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

BarArray.prototype.elementWidth  = GetterAndSetter("elementWidth", "setByEqual");
BarArray.prototype.elementHeight = GetterAndSetter("elementHeight", "setByEqual");
BarArray.prototype.updateList = [
    ...BarArray.prototype.updateList,
    update
];

BarArray.prototype.intValue = function(idx) {
    return this.value(idx);
}

BarArray.prototype.width = function(width) {
    if (width === undefined) {
        return this.elementWidth() * this.length();
    }
    const length = this.length() ? 1 : this.length();
    this.elementWidth(width / length);
    return this;
}

BarArray.prototype.height = function(height) {
    if (height === undefined) {
        return this.member.get("height");
    }
    const elements = this.member.get("elements");
    let maxValue = 1;
    for (let element of elements) {
        maxValue = Math.max(maxValue, element._.value);
    }
    this.elementHeight(height / maxValue);
    return this;
}

BarArray.prototype.insert = function(index, value) {
    value = +value;
    if (typeof(value) !== "number") throw new Error("Invalid Arguments");
    const parent = this;
    const element = new Rect(this.layer("elements"));
    element._.value = value;
    element.value = function(value) {
        if (value === undefined) return this._.value;
        this._.value = value;
        let baseline = this.my();
        this.height(value * parent.elementHeight());
        this.my(baseline);
        return this;
    }
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.update();
        element.startAnimate(this);
        element.opacity(1);
    };
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
