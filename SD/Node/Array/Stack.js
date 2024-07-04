import { Array } from "@/Node/Array/Array";
import { BaseArray } from "./BaseArray";
import { naiveGetterAndSetter } from "../Common";

export function Stack(parent) {
    BaseArray.call(this, parent);

    this.g().type("Stack");
    this.newLayer("elements");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("elementWidth", 40);
    this.member.new("elementHeight", 40);
}

Stack.prototype = {
    ...BaseArray.prototype
};

Stack.prototype.elementWidth  = naiveGetterAndSetter("elementWidth", "setByEqual");
Stack.prototype.elementHeight = naiveGetterAndSetter("elementHeight", "setByEqual");
Stack.prototype.insert                 = Array.prototype.insert;
Stack.prototype.insertFromExistValue   = Array.prototype.insertFromExistValue;
Stack.prototype.insertFromExistElement = Array.prototype.insertFromExistElement;
Stack.prototype.updateList = [
    ...Stack.prototype.updateList,
    update
];

/**
 * @overload
 * @param {number} width 
 * @returns {this}
 * @overload
 * @returns {number}
 */
Stack.prototype.width = function(width) {
    if (width === undefined) {
        return this.elementWidth();
    }
    this.elementWidth(width);
    return this;
}

/**
 * @overload
 * @param {number} height 
 * @returns {this}
 * @overload
 * @returns {number}
 */
Stack.prototype.height = function(height) {
    if (height === undefined) {
        return this.elementHeight() * this.length();
    }
    const length = this.length() ? this.length() : 1;
    this.elementHeight(height / length);
    return this;
}

function update() {
    if (this.member.hasChanged("x") ||
        this.member.hasChanged("y") || 
        this.member.hasChanged("elementWidth") ||
        this.member.hasChanged("elementHeight") ||
        this.member.hasChanged("elements")) {
        const x = this.x();
        let y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this.member.get("elements");
        for (let element of elements) {
            this.tryMove(element, () => {
                element.width(elementWidth);
                element.height(elementHeight);
                element.x(x).y(y);
            });
            y += elementHeight;
        }
        this.member.flush("x");
        this.member.flush("y");
        this.member.flush("elementWidth");
        this.member.flush("elementHeight");
        this.member.flush("elements");
    }
}

