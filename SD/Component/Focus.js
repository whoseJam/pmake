import { Rect } from "../Node/Nake/Rect";
import { Context } from "../Animate/Context";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Color } from "@/Utility/Color";

let id = 0;

function focus(rect, x, y, width, height) {
    rect.width(width);
    rect.height(height);
    rect.x(x).y(y);
}

function focusOn1Element(rect, element) {
    const x = element.x();
    const y = element.y();
    const width = element.width();
    const height = element.height();
    focus(rect, x, y, width, height);
}

function focusOn2Element(rect, element1, element2) {
    const x  = Math.min(element1. x(), element2. x());
    const mx = Math.max(element1.mx(), element2.mx());
    const y  = Math.min(element1. y(), element2. y());
    const my = Math.max(element1.my(), element2.my());
    const width = mx - x;
    const height = my - y;
    focus(rect, x, y, width, height);
}

export function Focus(parent) {
    const focus = new Rect(parent);
    let element1, element2;

    focus.fillOpacity(0);
    focus.stroke(Color.red);
    focus.strokeWidth(3);
    focusOn1Element(focus, parent);
    
    focus.focus = function(arg0, arg1, arg2, arg3) {
        if (arguments.length === 0) {
            element1 = parent;
            element2 = undefined;
        } else if (arguments.length === 1) {
            element1 = typeof(arg0) === "object" ? arg0 : parent.element(arg0);
            element2 = undefined;
        } else if (arguments.length === 2) {
            if (parent instanceof BaseArray) {
                element1 = parent.element(arg0);
                element2 = parent.element(arg1);
            } else {
                element1 = parent.element(arg0, arg1);
                element2 = undefined;
            }
        } else if (arguments.length === 4) {
            element1 = parent.element(arg0, arg1);
            element2 = parent.element(arg2, arg3);
        }

        const context = new Context(this);
        if (element1) {
            if (!this.opacity()) {
                context.till(0, 0);
                if (element2) focusOn2Element(this, element1, element2);
                else focusOn1Element(this, element1);
                context.till(0, 1);
                this.opacity(1);
            } else {
                if (element2) focusOn2Element(this, element1, element2);
                else focusOn1Element(this, element1);
            }
        } else this.opacity(0);
        context.recover();
        return this;
    }

    parent.childAs(`focus_${++id}`, focus, (parent, child) => {
        if (element1 && element2) focusOn2Element(child, element1, element2);
        else if (element1) focusOn1Element(child, element1);
    });

    focus.opacity(0);
    return focus;
}