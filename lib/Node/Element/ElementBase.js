import { CenterFixAspect } from "../../Rule/Center";
import { SDNode } from "../Node";
import { toNode } from "../../Utility/Tool";
import { svg } from "../../Interact/Svg";

/**
 * @class ElementBase
 * 
 * @description
 * 
 * 提供了把某个元素装在某个背景下的通用手段，背景可以是圆形背景，方形背景，元素
 * 可以是任意继承于Node的对象
 * 
 * 可以通过rate来设置背景与元素之间的空闲率，默认情况下元素是固定长宽比的
 */
export class ElementBase extends SDNode {
    constructor(node) {
        super(node);
        this.newLayer("background");
        this._.x = 0;
        this._.y = 0;
        this._.width = 40;
        this._.height = 40;
        this._.rate = 1.2;
    }

    // --------------------控制value--------------------
    rate(rate) {
        if (rate === undefined) return this._.rate;
        this._.rate = rate;
        const value = this.child("value");
        if (value) value.rule = CenterFixAspect(this._.rate);
        return this;
    }
    drop() {
        const ovalue = this.children.erase("value");
        ovalue.attachTo(svg());
        return this;
    }
    value(value, rule) {
        if (value === undefined) return this.child("value");
        rule = rule ? rule : CenterFixAspect(this._.rate);
        value = toNode(this, value);
        const ovalue = this.children.erase("value");
        if (ovalue) ovalue.startAnimate(this).opacity(0).remove();
        if (!value) return this;
        value._.enter = (node, move) => {
            node.opacity(0);
            move();
            node.startAnimate(this).opacity(1);
        };
        this.childAs("value", value, rule);
        this.dirty();
        return this;
    }
    valueFromExist(value, rule) {
        rule = rule ? rule : CenterFixAspect(this._.rate);
        const ovalue = this.children.erase("value");
        if (ovalue) ovalue.startAnimate(this).opacity(0).remove();
        value._.enter = (node, move) => {
            node.startAnimate(this);
            move();
            node.attachTo(this);
        };
        this.children.push("value", value, rule);
        this.dirty();
        return this;
    }

    // --------------------转发Background--------------------
    color(color) {
        let back = this.child("background");
        if (color === undefined) return back.color();
        back.color(color);
        return this;
    }
    fill(fill) {
        let back = this.child("background");
        if (fill === undefined) return back.fill();
        back.fill(fill);
        return this;
    }
    fillOpacity(fillOpacity) {
        let back = this.child("background");
        if (fillOpacity === undefined) return back.fillOpacity();
        back.fillOpacity(fillOpacity);
        return this;
    }
    stroke(stroke) {
        let back = this.child("background");
        if (stroke === undefined) return back.stroke();
        back.stroke(stroke);
        return this;
    }
    strokeOpacity(strokeOpacity) {
        let back = this.child("background");
        if (strokeOpacity === undefined) return back.strokeOpacity();
        back.strokeOpacity(strokeOpacity);
        return this;
    }
    strokeWidth(strokeWidth) {
        let back = this.child("background");
        if (strokeWidth === undefined) return back.strokeWidth();
        back.strokeWidth(strokeWidth);
        return this;
    }
}