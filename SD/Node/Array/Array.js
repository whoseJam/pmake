import { BaseArray } from "@/Node/Array/BaseArray";
import { Box } from "@/Node/Element/Box";
import { Enter as EN } from "@/Node/SDNode/Enter";
import { effect } from "@/Node/SDNode/SDValue";
import { Factory } from "@/Utility/Factory";
import { checkEffect } from "../SDNode/SDValue";

export function Array(parent) {
    BaseArray.call(this, parent);

    this.type("Array");
    this.newLayer("elements");

    this.vars.merge({
        x: 0,
        y: 0,
        elementWidth: 40,
        elementHeight: 40
    });

    const e = effect(() => {
        console.log("touch array effect length=", this.vars.elements.length);
        this.vars.elements.forEach((element, i) => {
            console.log("set x=", this.x());
            element.x(this.x() + i * this.elementWidth());
            element.y(this.y());
            element.width(this.elementWidth());
            element.height(this.elementHeight());
        });
    });
    checkEffect(e);
}

Array.prototype = {
    ...BaseArray.prototype
}

Array.prototype.elementWidth = Factory.handlerLowPrecise("elementWidth");
Array.prototype.elementHeight = Factory.handlerLowPrecise("elementHeight");

Array.prototype.width = function (width) {
    if (width === undefined) return this.elementWidth() * this.length();
    const length = this.length() ? this.length() : 1;
    this.elementWidth(width / length);
    return this;
}

Array.prototype.height = function (height) {
    if (height === undefined) return this.elementHeight();
    this.elementHeight(height);
    return this;
}

Array.prototype.insert = function (id, value) {
    const element = new Box(this.layer("elements"));
    element.value(value);
    element.onEnter(EN.appear());
    this.insertByBaseArray(id, element);
    return this;
}

Array.prototype.insertFromExistValue = function (id, value) {
    const element = new Box(this.layer("elements"));
    element.onEnter(EN.fromExistValue(this, value, "elements"));
    this.insertByBaseArray(id, element);
    return this;
}

Array.prototype.insertFromExistElement = function (id, value) {
    if (!(value instanceof Box)) throw new Error("Invalid Arguments");
    const element = value;
    element.onEnter(EN.fromExist(this, "elements"));
    this.insertByBaseArray(id, value);
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