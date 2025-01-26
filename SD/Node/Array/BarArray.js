import { Array } from "@/Node/Array/Array";
import { BaseArray } from "@/Node/Array/BaseArray";
import { Enter as EN } from "@/Node/Core/Enter";
import { Rect } from "@/Node/Nake/Rect";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

export function BarArray(parent) {
    BaseArray.call(this, parent);

    this.type("BarArray");

    this.vars.merge({
        x: 0,
        y: 0,
        elementWidth: 40,
        elementHeight: 40,
        height: 0,
    });

    this.effect("barArray", () => {
        const y = this.my();
        let maxHeight = 0;
        this.vars.elements.forEach((element, i) => {
            element.width(this.elementWidth());
            element.height(this.elementHeight() * element.value());
            element.x(this.x() + i * this.elementWidth());
            element.my(y);
            maxHeight = Math.max(maxHeight, this.elementHeight() * element.value());
        });
        this.vars.height = maxHeight;
        this.vars.y = y - maxHeight;
    });
}

BarArray.prototype = {
    ...BaseArray.prototype,
    elementWidth: Factory.handlerLowPrecise("elementWidth"),
    elementHeight: Factory.handlerLowPrecise("elementHeight"),
    intValue: function (idx) {
        return this.value(idx);
    },
    width: Array.prototype.width,
    height: function (height) {
        if (height === undefined) return this.vars.height;
        const elements = this.vars.elements;
        let maxValue = elements.reduce((maxValue, element) => Math.max(maxValue, element.value()));
        this.elementHeight(height / Math.max(1, maxValue));
        return this;
    },
    insert: function (id, value) {
        console.log("id=", id, "value=", value);
        value = +value;
        if (typeof value !== "number") ErrorLauncher.invalidArguments();
        const element = new Rect(this.layer("elements")).opacity(0);
        element.vars.value = value;
        element.value = function (value) {
            if (value === undefined) return this.vars.value;
            this.vars.value = value;
            const baseline = this.my();
            this.height(value * this.parent.elementHeight());
            this.my(baseline);
            return this;
        };
        element.intValue = function () {
            return this.value();
        };
        element.onEnter(EN.appear("elements"));
        this.insertByBaseArray(id, element);
        return this;
    },
};
