import { BaseArray } from "@/Node/Array/BaseArray";
import { Box } from "@/Node/Element/Box";
import { SDNode } from "@/Node/SDNode";
import { naiveGetterAndSetter } from "../Common";

export function Array(parent) {
    BaseArray.call(this, parent);
    
    this.g().type("Array");
    this.newLayer("elements");
    
    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("elementWidth", 40);
    this.member.new("elementHeight", 40);
}

Array.prototype = {
    ...BaseArray.prototype
}

Array.prototype.elementWidth  = naiveGetterAndSetter("elementWidth", "setByEqual");
Array.prototype.elementHeight = naiveGetterAndSetter("elementHeight", "setByEqual");
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

Array.prototype.insert = function(idx, value = null) {
    const elem = new Box(this.layer("elements"));
    elem.value(value);
    elem._.enter = (elem, move) => {
        elem.opacity(0);
        move();
        elem.unfreeze();
        elem.freeze();
        elem.startAnimate(this);
        elem.opacity(1);
    };
    this.insertByBaseArray(idx, elem);
    return this;
}

/**
 * 插入一个已经存在的元素，到数组的指定位置处
 * @param {number} idx 
 * @param {SDNode} value 
 * @returns {this}
 */
Array.prototype.insertFromExistValue = function(idx, value) {
    const elem = new Box(this.layer("elements"));
    elem._.enter = (elem, move) => {
        elem.opacity(0);
        move();
        elem.startAnimate(this);
        elem.opacity(1);
        elem.valueFromExist(value);
    };
    this.insertByBaseArray(idx, elem);
    return this;
}

Array.prototype.insertFromExistElement = function(idx, value) {
    if (!(value instanceof Box)) throw new Error("Invalid Arguments");
    value._.enter = (elem, move) => {
        elem.attachTo(this.layer("elements"));
        elem.startAnimate(this);
        move();
        elem.opacity(1);
    };
    this.insertByBaseArray(idx, value);
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