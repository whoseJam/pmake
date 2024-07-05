import { Context } from "@/Animate/Context";
import { Rect } from "@/Node/Nake/Rect";
import { toNode } from "@/Utility/Tool";
import { BaseArray } from "./BaseArray";
import { naiveGetterAndSetter } from "../Common";

export function Code(parent) {
    BaseArray.call(this, parent);

    this.g().type("Code");

    this.member.new("l", null);
    this.member.new("r", null);
    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 0);
    this.member.new("height", 0);
    this.member.new("font-size", 20);
    this.member.set("start", 1);

    this.children.push(
        "focus",
        new Rect(this).color(Color.BLUE).opacity(0),
        (parent, child) => {
            if (typeof(parent.l()) !== "number") return;
            const elementL = parent.element(parent.l());
            const elementR = parent.element(parent.r());
            child.x(elementL.x());
            child.y(elementL.y());
            child.width(parent.width());
            child.height(elementR.my() - elementL.y());
        }
    );

    this.newLayer("elements");

    return this;
}

Code.prototype = {
    ...BaseArray.prototype
};

Code.prototype.fontSize = naiveGetterAndSetter("font-size", "setByEqual");

Code.prototype.updateList = [
    ...Code.prototype.updateList,
    update
];

Code.prototype.width = function(width) {
    if (width === undefined) {
        return this.member.get("width");
    }
    const k = width / this.member.get("width");
    this.fontSize(this.fontSize() * k);
    return this;
}

Code.prototype.height = function(height) {
    if (height === undefined) {
        return this.member.get("height");
    }
    const k = height / this.member.get("height");
    this.fontSize(this.fontSize() * k);
    return this;
}

Code.prototype.insert = function(idx, value = "") {
    const elem = toNode(this.layer("elements"), value);
    elem._.enter = (elem, move) => {
        elem.opacity(0);
        move();
        elem.unfreeze();
        elem.freeze();
        elem.startAnimate(this);
        elem.opacity(1);
    }
    this.insertByBaseArray(idx, elem);
    this.tryUpdate();
    return this;
}

Code.prototype.code = function(source) {
    for (let i = this.end(); i >= this.start(); i--)
        this.erase(i);
    let ans = "";
    for (let i = 0; i < source.length; i++) {
        if (source[i] === "\n") {
            if (ans != "") this.push(ans);
            ans = "";
        } else ans += source[i];
    }
    if (ans.length > 0) this.push(ans);
    return this;
}

Code.prototype.focus = function(l, r) {
    const focus = this.child("focus");
    if (l === null) {
        this.member.set("l", null);
        this.member.set("r", null);
        focus.opacity(0);
        return this;
    } else if (arguments.length === 1) {
        l = r = arguments[0];
    }
    this.member.set("l", l);
    this.member.set("r", r);
    if (!focus.opacity()) {
        focus._.enter = (elem, move) => {
            const context = new Context(this);
            elem.startAnimate(context.tillc(0, 0));
            move();
            elem.unfreeze();
            elem.freeze();
            elem.startAnimate(context.tillc(0, 1));
            elem.opacity(1);
        };
    }
    this.tryUpdate();
    return this;
}

Code.prototype.l = function() {
    return this.member.get("l");
}

Code.prototype.r = function() {
    return this.member.get("r");
}

Code.prototype.value = function() {
    return this.element.apply(this, arguments);
}

function update() {
    const x = this.x();
    let y = this.y();
    let width = 0;
    let height = 0;
    const fontSize = this.fontSize();
    const elements = this.member.get("elements");
    for (let element of elements) {
        this.tryMove(element, () => {
            element.fontSize(fontSize);
            element.x(x).y(y);
        });
        y += element.height();
        width = Math.max(width, element.width());
        height += element.height();
    }
    this.member.set("width", width);
    this.member.set("height", height);
    return this;
}