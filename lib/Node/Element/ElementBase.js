import { SDHelper } from "../../Utility/SDHelper";
import * as Rule from "../../Rule/Rule";
import { Node } from "../Node";

export class ElementBase extends Node {
    constructor(conf) {
        super(conf);
        this._.x = 0;
        this._.y = 0;
        this._.width = 40;
        this._.height = 40;
    }
    
    background() {
        return this._.background;
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

    inRange() {
        return this.dispatch("background", "inRange", arguments);
    }

    value(value) {
        if (value === undefined)
            return this.children.child("value");
        value = SDHelper.any2Slide(this, value);
        let ovalue = this.children.erase("value");
        if (ovalue) {
            ovalue.opacity(0).remove();
        }
        if (!value) return this;
        value.attachTo(this.layer("value"));
        this.children.push("value", value, Rule.CenterFixAspect(1.2));
        value.opacity(0);
        value.startAnimate(this);
        value.opacity(1);
        return this;
    }
}