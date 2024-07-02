import { Color } from "../Utility/Color";
import { Rect } from "../Node/Basic/Rect";
import { Context } from "../Animate/Context";
import { SDNode } from "../Node/SDNode";
import { ArrayBase } from "@/Node/Array/ArrayBase";

let id = 0;

function focusOn1Element(rect, elem) {
    rect.x(elem.x()).y(elem.y()).width(elem.width()).height(elem.height());
}

function focusOn2Element(rect, elem1, elem2) {
    const x = Math.min(elem1.x(), elem2.x()), mx = Math.max(elem1.mx(), elem2.mx());
    const y = Math.min(elem2.y(), elem2.y()), my = Math.max(elem1.my(), elem2.my());
    rect.x(x).y(y).width(mx - x).height(my - y);
}

function initFocus(node, focus) {
    focus.fillOpacity(0);
    focus.stroke(Color.red);
    focus.strokeWidth(3);
    focusOn1Element(focus, node);
}

/**
 * 
 * @param {SDNode} node 
 * @returns 
 */
export function Focus(node) {
    const focus = new Rect(node);
    let elem1, elem2;
    initFocus(node, focus);

    
    focus.focus = function(arg0, arg1, arg2, arg3) {
        if (arguments.length === 0) {
            elem1 = node;
            elem2 = undefined;
        }
        else if (arguments.length === 1 && typeof(arguments[0]) === "object") {
            elem1 = arguments[0];
            elem2 = undefined;
        } else if (arguments.length === 2) {
            if (node instanceof ArrayBase) {
                elem1 = node.element(arg0);
                elem2 = node.element(arg1);
            } else {
                elem1 = node.element(arg0, arg1);
                elem2 = undefined;
            }
        } else if (arguments.length === 4) {
            elem1 = node.element(arg0, arg1);
            elem2 = node.element(arg2, arg3);
        }

        const context = new Context(this);
        if (elem1) {
            if (!this.opacity()) {
                context.till(0, 0);
                if (elem2) focusOn2Element(this, elem1, elem2);
                else focusOn1Element(this, elem1);
                context.till(0, 1);
                this.opacity(1);
            } else {
                if (elem2) focusOn1Element(this, elem1, elme2);
                else focusOn1Element(this, elem1);
            }
        } else this.opacity(0);
        context.recover();
        return this;
    }

    node.childAs(`focus_${++id}`, focus, (parent, child) => {
        if (elem1 && elem2) focusOn2Element(child, elem1, elem2);
        else if (elem1) focusOn1Element(child, elem1);
    });

    focus.opacity(0);
    return focus;
}