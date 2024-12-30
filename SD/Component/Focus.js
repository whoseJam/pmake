import { Context } from "@/Animate/Context";
import { Rect } from "@/Node/Nake/Rect";
import { Check } from "@/Utility/Check";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

let ID = 0;

function FocusRule(parent, child) {
    function focus(x, y, width, height) {
        if (child.rate() !== undefined) {
            const r = child.rate();
            child.width(width * r);
            child.height(height * r);
            child.x(x - width * (r - 0.5));
            child.y(y - height * (r - 0.5));
        } else if (child.gap() !== undefined) {
            const g = child.gap();
            child.width(width + g * 2);
            child.height(height + g * 2);
            child.x(x - g).y(y - g);
        } else {
            child.width(width);
            child.height(height);
            child.x(x).y(y);
        }
    }
    if (child.vars.element1) {
        if (child.vars.element2) {
            const element1 = child.vars.element1;
            const element2 = child.vars.element2;
            const x = Math.min(element1.x(), element2.x());
            const mx = Math.max(element1.mx(), element2.mx());
            const y = Math.min(element1.y(), element2.y());
            const my = Math.max(element1.my(), element2.my());
            focus(x, y, mx - x, my - y);
        } else {
            const element = child.vars.element1;
            focus(element.x(), element.y(), element.width(), element.height());
        }
    } else child.opacity(0);
}

export function Focus(parent) {
    const focus = new Rect(parent).opacity(0);
    focus.fillOpacity(0);
    focus.stroke(C.red);
    focus.strokeWidth(3);

    focus.vars.merge({
        element1: undefined,
        element2: undefined,
        rate: undefined,
        gap: undefined
    });

    focus.focus = function (arg0, arg1, arg2, arg3) {
        const args = arguments;
        const update = () => {
            this.vars.freeze();
            switch (args.length) {
                case 0:
                    this.vars.element1 = parent;
                    this.vars.element2 = undefined;
                    break;
                case 1:
                    if (Check.isFalseType(arg0)) {
                        this.vars.element1 = undefined;
                        this.vars.element2 = undefined;
                    } else {
                        this.vars.element1 = typeof arg0 === "object" ? arg0 : parent.element(arg0);
                        this.vars.element2 = undefined;
                    }
                    break;
                case 2:
                    if (Check.isTypeOfSDNode(arg0) && Check.isTypeOfSDNode(arg1)) {
                        this.vars.element1 = arg0;
                        this.vars.element2 = arg1;
                    } else if (Check.isTypeOfGrid(parent)) {
                        this.vars.element1 = parent.element(arg0, arg1);
                        this.vars.element2 = undefined;
                    } else {
                        this.vars.element1 = parent.element(arg0);
                        this.vars.element2 = parent.element(arg1);
                    }
                    break;
                case 4:
                    this.vars.element1 = parent.element(arg0, arg1);
                    this.vars.element2 = parent.element(arg2, arg3);
                    break;
            }
            this.vars.unfreeze();
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

    focus.gap = Factory.handlerLowPrecise("gap");
    focus.rate = Factory.handlerMediumPrecise("rate");

    if (parent.childAs) parent.childAs(`focus_${++ID}`, focus, FocusRule);
    else focus.rule(FocusRule);
    return focus;
}
