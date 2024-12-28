import { Array } from "@/Node/Array/Array";
import { Enter as EN } from "@/Node/SDNode/Enter";
import { effect, uneffect } from "@/Node/SDNode/SDValue";
import { Cast } from "@/Utility/Cast";
import { Factory } from "@/Utility/Factory";

export function ValueArray(parent) {
    Array.call(this, parent);

    this.type("ValueArray");

    this.vars.merge({
        align: "cy"
    });

    uneffect(this._.updater);

    this._.updater = effect(() => {
        const align = this.align();
        this.vars.elements.forEach((element, i) => {
            element.cx(this.x() + this.elementWidth() * (i + 0.5));
            element[align](this[align]());
        });
    });
}

ValueArray.prototype = {
    ...Array.prototype
};

ValueArray.prototype.align = Factory.handler("align");

ValueArray.prototype.insert = function (id, value) {
    const element = Cast.castToSDNode(this.layer("elements"), value);
    element.onEnter(EN.appear("elements"))
    this.insertByBaseArray(id, element);
    return this;
}

ValueArray.prototype.insertFromExistValue = function (id, value) {
    const element = value;
    element.onEnter(EN.moveTo("elements"));
    this.insertByBaseArray(id, element);
    return this;
}

ValueArray.prototype.insertFromExistElement = ValueArray.prototype.insertFromExistValue;
