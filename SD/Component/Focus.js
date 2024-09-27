import { Rect } from "@/Node/Nake/Rect";

import { Context } from "@/Animate/Context";

import { color } from "@/Utility/Color";
import { Check } from "@/Utility/Check";

const C = color();

let focusID = 0;

function FocusRule(parent, child) {
    const focusCount = child.member.getAndFlush("focusCount");
    function focus(x, y, width, height) {
        child.width(width);
        child.height(height);
        child.x(x).y(y);
    }
    if (focusCount === 0) {
        child.member.flush("focusElement1");
        child.member.flush("focusElement2");
        child.opacity(0);
    } else if (focusCount === 1) {
        const element = child.member.getAndFlush("focusElement1");
        child.member.flush("focusElement2");
        focus(element.x(), element.y(), element.width(), element.height());
    } else {
        const element1 = child.member.getAndFlush("focusElement1");
        const element2 = child.member.getAndFlush("focusElement2");
        const x  = Math.min(element1. x(), element2. x());
        const mx = Math.max(element1.mx(), element2.mx());
        const y  = Math.min(element1. y(), element2. y());
        const my = Math.max(element1.my(), element2.my());
        focus(x, y, mx - x, my - y);
    }
}

export function Focus(parent) {
    const focus = new Rect(parent).opacity(0);
    focus.fillOpacity(0);
    focus.stroke(C.red);
    focus.strokeWidth(3);

    focus.member.new("focusElement1", undefined);
    focus.member.new("focusElement2", undefined);
    focus.member.new("focusCount", 0);

    focus.attachUpdate(() => {
        if (focus.member.hasChanged("focusElement1") ||
            focus.member.hasChanged("focusElement2") ||
            focus.member.hasChanged("focusCount")) {
            focus.triggerRule();
        }
    });
    
    focus.focus = function(arg0, arg1, arg2, arg3) {
        if (arguments.length === 0) {
            this.member.set("focusElement1", parent);
            this.member.set("focusElement2", undefined);
            this.member.set("focusCount", 1);
        } else if (arguments.length === 1) {
            if (Check.isFalseType(arg0)) {
                this.member.set("focusElement1", undefined);
                this.member.set("focusElement2", undefined);
                this.member.set("focusCount", 0);
            } else {
                this.member.set("focusElement1", typeof(arg0) === "object" ? arg0 : parent.element(arg0));
                this.member.set("focusElement2", undefined);
                this.member.set("focusCount", 1);
            }
        } else if (arguments.length === 2) {
            if (Check.isTypeOfGrid(parent)) {
                this.member.set("focusElement1", parent.element(arg0, arg1));
                this.member.set("focusElement2", undefined);
                this.member.set("focusCount", 1);
            } else {
                this.member.set("focusElement1", parent.element(arg0));
                this.member.set("focusElement2", parent.element(arg1));
                this.member.set("focusCount", 2);
            }
        } else if (arguments.length === 4) {
            this.member.set("focusElement1", parent.element(arg0, arg1));
            this.member.set("focusElement2", parent.element(arg2, arg3));
            this.member.set("focusCount", 2);
        }

        if (this.opacity() === 0) {
            const context = new Context(this);
            this.startAnimate(context.tillc(0, 0));
            this.update();
            this.startAnimate(context.tillc(0, 1));
            this.opacity(1);
        } else {
            this.update();
        }
        return this;
    }

    parent.childAs(`focus_${++focusID}`, focus, FocusRule);
    return focus;
}