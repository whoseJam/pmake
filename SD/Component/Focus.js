import { Rect } from "@/Node/Nake/Rect";
import { Context } from "@/Animate/Context";
import { Color as C } from "@/Utility/Color";
import { Check } from "@/Utility/Check";
import { Factory } from "@/Utility/Factory";

let ID = 0;

function FocusRule(parent, child) {
    const focusCount = child.vars.focusCount;
    const focusRate = child.vars.focusRate;
    const focusGap = child.vars.focusGap;
    function focus(x, y, width, height, rate) {
        if (focusRate !== undefined) {
            const w = width * rate;
            const h = height * rate;
            child.width(w);
            child.height(h);
            child.x(x - (w - width) / 2);
            child.y(y - (h - height) / 2);
        } else if (focusGap !== undefined) {
            child.width(width + focusGap * 2);
            child.height(height + focusGap * 2);
            child.x(x - focusGap);
            child.y(y - focusGap);
        } else {
            child.width(width);
            child.height(height);
            child.x(x).y(y);
        }
    }
    if (focusCount === 0) {
        child.opacity(0);
    } else if (focusCount === 1) {
        const element = child.vars.focusElement1;
        focus(
            element.x(),
            element.y(),
            element.width(),
            element.height(),
            focusRate,
        );
    } else {
        const element1 = child.vars.focusElement1;
        const element2 = child.vars.focusElement2;
        const x = Math.min(element1.x(), element2.x());
        const mx = Math.max(element1.mx(), element2.mx());
        const y = Math.min(element1.y(), element2.y());
        const my = Math.max(element1.my(), element2.my());
        focus(x, y, mx - x, my - y, focusRate);
    }
}

export function Focus(parent) {
    const focus = new Rect(parent).opacity(0);
    focus.fillOpacity(0);
    focus.stroke(C.red);
    focus.strokeWidth(3);

    focus.vars.merge({
        focusElement1: undefined,
        focusElement2: undefined,
        focusRate: undefined,
        focusGap: undefined,
        focusCount: 0,
    });

    focus.focus = function (arg0, arg1, arg2, arg3) {
        const args = arguments;
        const update = () => {
            if (args.length === 0) {
                this.vars.focusElement1 = parent;
                this.vars.focusElement2 = undefined;
                this.vars.focusCount = 1;
            } else if (arguments.length === 1) {
                if (Check.isFalseType(arg0)) {
                    this.vars.focusElement1 = undefined;
                    this.vars.focusElement2 = undefined;
                    this.vars.focusCount = 0;
                    this.opacity(0);
                    return this;
                } else {
                    this.vars.focusElement1 =
                        typeof arg0 === "object" ? arg0 : parent.element(arg0);
                    this.vars.focusElement2 = undefined;
                    this.vars.focusCount = 1;
                }
            } else if (arguments.length === 2) {
                if (Check.isTypeOfSDNode(arg0) && Check.isTypeOfSDNode(arg1)) {
                    this.vars.focusElement1 = arg0;
                    this.vars.focusElement2 = arg1;
                    this.vars.focusCount = 2;
                } else if (Check.isTypeOfGrid(parent)) {
                    this.vars.focusElement1 = parent.element(arg0, arg1);
                    this.vars.focusElement2 = undefined;
                    this.vars.focusCount = 1;
                } else {
                    this.vars.focusElement1 = parent.element(arg0);
                    this.vars.focusElement2 = parent.element(arg1);
                    this.vars.focusCount = 2;
                }
            } else if (arguments.length === 4) {
                this.vars.focusElement1 = parent.element(arg0, arg1);
                this.vars.focusElement2 = parent.element(arg2, arg3);
                this.vars.focusCount = 2;
            }
        };

        if (this.opacity() === 0) {
            const context = new Context(this);
            this.startAnimate(context.tillc(0, 0));
            update();
            this.startAnimate(context.tillc(0, 1));
            this.opacity(1);
        } else update();
        return this;
    };

    focus.gap = Factory.handlerLowPrecise("focusGap");
    focus.rate = Factory.handlerMediumPrecise("focusRate");

    if (parent.childAs) parent.childAs(`focus_${++ID}`, focus, FocusRule);
    else focus.rule(FocusRule);
    return focus;
}
