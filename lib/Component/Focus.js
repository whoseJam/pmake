import { ArrayBase } from "../Node/Array/ArrayBase";
import { Color } from "../Utility/Color";
import { GridBase } from "../Node/Grid/GridBase";
import { TreeBase } from "../Node/Tree/TreeBase";
import { Rect } from "../Node/Basic/Rect";

function focusOn1Element(rect, elem) {
    rect.x(elem.x()).y(elem.y()).width(elem.width()).height(elem.height());
}

function focusOn2Element(rect, elem1, elem2) {
    let x = Math.min(elem1.x(), elem2.x()), mx = Math.max(elem1.mx(), elem2.mx());
    let y = Math.min(elem2.y(), elem2.y()), my = Math.max(elem1.my(), elem2.my());
    rect.x(x).y(y).width(mx - x).height(my - y);
}

export function Focus(node) {
    let focus = new Rect(node);
    focus.fillOpacity(0).stroke(Color.red).strokeWidth(3);
    focus.focus = function() {
        let s = this.delay(), l = this.duration();
        if (this.opacity() === 0) this.endAnimate().after(s);
        if (arguments.length === 1 && typeof(arguments[0]) === "object") focusOn1Element(this, arguments[0])
        else if (arguments.length === 2 && typeof(arguments[0]) === "object") focusOn2Element(this, arguments[0], arguments[1]);
        let v0 = arguments[0], v1 = arguments[1];
        let v2 = arguments[2], v3 = arguments[3];
        if (node instanceof ArrayBase || node instanceof TreeBase) {
            if (arguments.length === 1) focusOn1Element(this, node.element(v0));
            else focusOn2Element(this, node.element(v0), node.element(v1));
        } else if (node instanceof GridBase) {
            if (arguments.length === 2) focusOn1Element(this, node.element(v0, v1));
            else focusOn2Element(this, node.element(v0, v1), node.element(v2, v3));
        }
        if (this.opacity() === 0) this.startAnimate(l).opacity(1);
        return this;
    }
    focus.opacity(0);
    return focus;
}