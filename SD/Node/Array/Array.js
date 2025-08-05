import { BaseArray } from "@/Node/Array/BaseArray";
import { Enter as EN } from "@/Node/Core/Enter";
import { Box } from "@/Node/Element/Box";
import { Check } from "@/Utility/Check";

export class Array extends BaseArray {
    constructor(target) {
        super(target);

        this.type("Array");

        this.vars.merge({
            x: 0,
            y: 0,
            elementWidth: 40,
            elementHeight: 40,
            ob: {
                x: 1,
                y: 2,
            },
        });

        this.effect("array", () => {
            this.forEachElement((element, i) => {
                this.tryUpdate(element, () => {
                    element.x(this.x() + i * this.elementWidth());
                    element.y(this.y());
                    element.width(this.elementWidth());
                    element.height(this.elementHeight());
                });
            });
        });

        this.vars.watch("ob.x", nx => {
            console.log("ob.x=", nx);
        });
        this.vars.watch("ob.y", ny => {
            console.log("ob.y=", ny);
        });
    }
}

Object.assign(Array.prototype, {
    width(width) {
        if (arguments.length === 0) return this.elementWidth() * this.length();
        const length = Math.max(this.length(), 1);
        return this.elementWidth(width / length);
    },
    height(height) {
        if (arguments.length === 0) return this.elementHeight();
        return this.elementHeight(height);
    },
    insert(id, value) {
        const element = new Box(this.layer("elements"), value).opacity(0);
        element.onEnter(EN.appear("elements"));
        this.__insert(id, element);
        return this;
    },
    insertFromExistValue(id, value) {
        const element = new Box(this.layer("elements")).opacity(0);
        element.onEnter(EN.appear("elements"));
        this.__insert(id, element);
        element.valueFromExist(value);
        return this;
    },
    insertFromExistElement(id, element) {
        element.onEnter(EN.moveTo("elements"));
        this.__insert(id, element);
        return this;
    },
    elementWidth(width) {
        if (arguments.length === 0) return this.vars.elementWidth;
        Check.validateNumber(width, `${this.constructor.name}.width`);
        this.vars.lpset("elementWidth", width);
        return this;
    },
    elementHeight(height) {
        if (arguments.length === 0) return this.vars.elementHeight;
        Check.validateNumber(height, `${this.constructor.name}.height`);
        this.vars.lpset("elementHeight", height);
        return this;
    },
});
