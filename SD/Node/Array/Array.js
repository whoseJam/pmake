import { Box }             from "@/Node/Element/Box";
import { BaseArray }       from "@/Node/Array/BaseArray";
import { GetterAndSetter } from "@/Node/Common";

export function Array(parent) {
    BaseArray.call(this, parent);
    
    this.g().type("Array");
    this.newLayer("elements");
    
    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("elementWidth", 40);
    this.member.new("elementHeight", 40);

    return this;
}

Array.prototype = {
    ...BaseArray.prototype
}

Array.prototype.elementWidth  = GetterAndSetter("elementWidth", "setByEqual");
Array.prototype.elementHeight = GetterAndSetter("elementHeight", "setByEqual");
Array.prototype.updateList = [
    ...Array.prototype.updateList,
    update
];

Array.prototype.width = function(width) {
    if (width === undefined) {
        return this.elementWidth() * this.length();
    }
    const length = this.length() ? this.length() : 1;
    this.elementWidth(width / length);
    return this;
}

Array.prototype.height = function(height) {
    if (height === undefined) {
        return this.elementHeight();
    }
    this.elementHeight(height);
    return this;
}

Array.prototype.insert = function(index, value) {
    const element = new Box(this.layer("elements"));
    element.value(value);
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

Array.prototype.insertFromExistValue = function(index, value) {
    const element = new Box(this.layer("elements"));
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.startAnimate(this);
        element.opacity(1);
        element.valueFromExist(value);
    };
    this.insertByBaseArray(index, element);
    return this;
}

Array.prototype.insertFromExistElement = function(index, value) {
    if (!(value instanceof Box)) throw new Error("Invalid Arguments");
    value._.enter = (element, move) => {
        element.attachTo(this.layer("elements"));
        element.startAnimate(this);
        move();
        element.opacity(1);
    };
    this.insertByBaseArray(index, value);
    return this;
}

function update() {
    if (this.member.hasChanged("x") || 
        this.member.hasChanged("y") ||
        this.member.hasChanged("elementWidth") || 
        this.member.hasChanged("elementHeight") ||
        this.member.hasChanged("elements")) {
        let x = this.x();
        const y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this.member.get("elements");
        for (let element of elements) {
            this.tryMove(element, () => {
                element.width(elementWidth);
                element.height(elementHeight);
                element.x(x).y(y);
            });
            x += elementWidth;
        }
        this.member.flush("x");
        this.member.flush("y");
        this.member.flush("elementWidth");
        this.member.flush("elementHeight");
        this.member.flush("elements");
    }
}