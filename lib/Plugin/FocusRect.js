import { Rect } from "../Structure/Basic/Rect";
import { Color } from "../Utility/Color";

export function EnableFocusRect(item) {
    let rect = Rect(item);
    rect.fillOpacity(0);
    rect.stroke(Color.red);
    rect.strokeWidth(3);
    
    item.focus = focus;
    item.focusRect = function() {
        return rect;
    };

    item.children.push("focusRect", rect, rule);

    return item;
}

function focus() {
    let elem = this.element.apply(this, arguments);
    let rect = this.children.child("focusRect");
    if (rect.focusArgs) {
        rect.x(elem.x()).y(elem.y());
        rect.width(elem.width());
        rect.height(elem.height());
    } else {
        rect.endAnimate();
        rect.after(this);
        rect.x(elem.x()).y(elem.y());
        rect.width(elem.width());
        rect.height(elem.height());
        rect.startAnimate(this);
        rect.opacity(1);
    }
    rect.focusArgs = arguments;
}

function rule(item, rect) {
    if (!rect.focusArgs) { rect.opacity(0); return; }
    let elem = item.element.apply(item, rect.focusArgs);
    rect.opacity(1);
    rect.x(elem.x()).y(elem.y());
    rect.width(elem.width());
    rect.height(elem.height());
}