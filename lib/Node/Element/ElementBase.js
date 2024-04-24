import { CenterFixAspect } from "../../Rule/Center";
import { Node } from "../Node";
import { Text } from "../Basic/Text";

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
export class ElementBase extends Node {
    constructor(node) {
        super(node);
        this._.x = 0;
        this._.y = 0;
        this._.width = 40;
        this._.height = 40;
        this._.rate = 1.2;
    }
    
    background() {
        return this.child("background");
    }

    color() {
        return this.dispatch("background", "color", arguments);
    }

    fill() {
        return this.dispatch("background", "fill", arguments);
    }

    fillOpacity() {
        return this.dispatch("background", "fillOpacity", arguments);
    }

    stroke() {
        return this.dispatch("background", "stroke", arguments);
    }

    strokeOpacity() {
        return this.dispatch("background", "strokeOpacity", arguments);
    }

    strokeWidth() {
        return this.dispatch("background", "strokeWidth", arguments);
    }

    rate(rate) {
        if (rate === undefined) return this._.rate;
        this._.rate = rate;
        let value = this.child("value");
        if (value) value.rule = CenterFixAspect(this._.rate);
        return this;
    }

    value(value, rule) {
        if (value === undefined) return this.child("value");
        if (!(value instanceof Node)) value = new Text(this, value);
        let ovalue = this.children.erase("value");
        if (ovalue) ovalue.opacity(0).remove();
        if (!value) return this;
        value.events.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        value.events.enterFlag = true;
        this.childAs("value", value, rule ? rule : CenterFixAspect(this._.rate));
        return this;
    }

    valueFromExist(value) {
        let ovalue = this.children.erase("value");
        if (ovalue) ovalue.opacity(0).remove();
        value.events.enter = (elem, move) => {
            elem.startAnimate(this);
            move();
        };
        value.events.enterFlag = true;
        this.childAs("value", value, CenterFixAspect(this._.rate));
        return this;
    }
}