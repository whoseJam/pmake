import { Context } from "@/Animate/Context";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Rect } from "@/Node/Nake/Rect";
import { Enter as EN } from "@/Node/SDNode/Enter";
import { effect } from "@/Node/SDNode/SDValue";
import { Cast } from "@/Utility/Cast";
import { Check } from "@/Utility/Check";
import { Color } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

function focusRule(parent, child) {
    if (typeof parent.l() !== "number") return;
    const l = parent.element(parent.l());
    const r = parent.element(parent.r());
    child.x(l.x()).y(l.y());
    child.width(parent.width());
    child.height(r.my() - l.y());
}

export function Code(parent, source = undefined) {
    BaseArray.call(this, parent);

    this.type("Code");

    this.vars.merge({
        l: undefined,
        r: undefined,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fontSize: 20,
        start: 1,
    });

    this._.updater = effect(() => {
        const x = this.x();
        let y = this.y();
        let width = 0;
        let height = 0;
        const fontSize = this.fontSize();
        const elements = this.vars.elements;
        for (let element of elements) {
            element.fontSize(fontSize);
            element.x(x).y(y);
            y += element.height();
            width = Math.max(width, element.width());
            height += element.height();
        }
        this.vars.width = width;
        this.vars.height = height;
    });

    this.childAs("focus", new Rect(this).color(Color.BLUE).opacity(0), focusRule);

    this.newLayer("elements");

    if (source) this.code(source);
}

Code.prototype = {
    ...BaseArray.prototype,
};

Code.prototype.fontSize = Factory.handler("fontSize");

Code.prototype.width = function (width) {
    if (width === undefined) return this.vars.width;
    const k = width / this.vars.width;
    this.fontSize(this.fontSize() * k);
    return this;
};

Code.prototype.height = function (height) {
    if (height === undefined) return this.vars.height;
    const k = height / this.vars.height;
    this.fontSize(this.fontSize() * k);
    return this;
};

Code.prototype.insert = function (index, value = "") {
    const element = Cast.castToSDNode(this.layer("elements"), value);
    element.onEnter(EN.appear("elements"));
    this.insertByBaseArray(index, element);
    return this;
};

Code.prototype.code = function (source) {
    for (let i = this.end(); i >= this.start(); i--) this.erase(i);
    let ans = "";
    for (let i = 0; i < source.length; i++) {
        if (source[i] === "\n") {
            if (ans != "") this.push(ans);
            ans = "";
        } else ans += source[i];
    }
    if (ans.length > 0) this.push(ans);
    return this;
};

Code.prototype.focus = function (l, r) {
    const focus = this.child("focus");
    if (Check.isFalseType(l)) {
        this.freeze();
        this.vars.l = undefined;
        this.vars.r = undefined;
        this.unfreeze();
        focus.opacity(0);
        return this;
    } else if (arguments.length === 1) return focus(arguments[0], arguments[1]);
    const update = () => {
        this.freeze();
        this.vars.l = l;
        this.vars.r = r;
        this.unfreeze();
    };
    if (focus.opacity() === 0) {
        const context = new Context(focus);
        focus.startAnimate(context.tillc(0, 0));
        update();
        focus.startAnimate(context.tillc(0, 1));
        focus.opacity(1);
    } else update();
    return this;
};

Code.prototype.l = function () {
    return this.vars.l;
};

Code.prototype.r = function () {
    return this.vars.r;
};

Code.prototype.value = function () {
    return this.element.apply(this, arguments);
};
