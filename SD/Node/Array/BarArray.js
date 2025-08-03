import { Array } from "@/Node/Array/Array";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Enter as EN } from "@/Node/Core/Enter";
import { SD2DNode } from "@/Node/SD2DNode";
import { Rect } from "@/Node/Shape/Rect";
import { Rule as R } from "@/Rule/Rule";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { BaseElement } from "../Element/BaseElement";

class BarElement extends SD2DNode {
    constructor(target, value) {
        super(target);

        this.type("BarElement");

        this.vars.merge({
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            value,
        });

        const background = new Rect(this);
        this.childAs("background", background, R.background());
    }
}

Object.assign(BarElement.prototype, {
    x: BaseElement.prototype.x,
    y: BaseElement.prototype.y,
    width: BaseElement.prototype.width,
    height: BaseElement.prototype.height,
    color: BaseElement.prototype.color,
    fill: BaseElement.prototype.fill,
    fillOpacity: BaseElement.prototype.fillOpacity,
    stroke: BaseElement.prototype.stroke,
    strokeOpacity: BaseElement.prototype.strokeOpacity,
    strokeWidth: BaseElement.prototype.strokeWidth,
    text(text) {
        if (arguments.length === 0) return String(this.value());
        const i = Math.floor(+text);
        if (isNaN(i)) ErrorLauncher.failToParseAsIntValue(text);
        return this.value(i);
    },
    intValue() {
        return this.value();
    },
    value(value) {
        if (arguments.length === 0) return this.vars.value;
        Check.validateNumber(value, `${this.constructor.name}.value`);
        this.vars.value = value;
        return this;
    },
});

export class BarArray extends BaseArray {
    constructor(target) {
        super(target);

        this.type("BarArray");

        this.vars.merge({
            x: 0,
            y: 0,
            elementWidth: 40,
            elementHeight: 40,
            height: 0,
        });

        this.effect("array", () => {
            const y = this.my();
            let maxHeight = 0;
            this.forEachElement((element, i) => {
                this.tryUpdate(element, () => {
                    element.width(this.elementWidth());
                    element.height(this.elementHeight() * element.value());
                    element.x(this.x() + i * this.elementWidth());
                    element.my(y);
                    maxHeight = Math.max(maxHeight, this.elementHeight() * element.value());
                });
            });
            this.vars.height = maxHeight;
            this.vars.y = y - maxHeight;
        });
    }
}

Object.assign(BarArray.prototype, {
    width: Array.prototype.width,
    height(height) {
        if (height === undefined) return this.vars.height;
        const elements = this.vars.elements;
        let maxValue = elements.reduce((maxValue, element) => Math.max(maxValue, element.value()));
        this.elementHeight(height / Math.max(1, maxValue));
        return this;
    },
    insert(id, value) {
        const element = new BarElement(this.layer("elements"), value).opacity(0);
        element.onEnter(EN.appear("elements"));
        this.__insert(id, element);
        return this;
    },
    insertFromExistValue(id, value) {
        const element = value;
        element.onEnter(EN.moveTo("elements"));
        this.__insert(id, element);
        return this;
    },
    elementWidth: Array.prototype.elementWidth,
    elementHeight: Array.prototype.elementHeight,
});

BarArray.prototype.insertFromExistElement = BarArray.prototype.insertFromExistValue;
