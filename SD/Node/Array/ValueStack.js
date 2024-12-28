import { Stack } from "@/Node/Array/Stack";
import { ValueArray } from "@/Node/Array/ValueArray";
import { effect, uneffect } from "@/Node/SDNode/SDValue";
import { Factory } from "@/Utility/Factory";

export function ValueStack(parent) {
    Stack.call(this, parent);

    this.type("ValueStack");

    this.vars.merge({
        align: "cx"
    });

    uneffect(this._.updater);

    this._.updater = effect(() => {
        const align = this.align();
        this.vars.elements.forEach((element, i) => {
            element.cy(this.y() + this.elementHeight() * (i + 0.5));
            element[align](this[align]());
        });
    });
}

ValueStack.prototype = {
    ...Stack.prototype
};

ValueStack.prototype.align = Factory.handler("align");
ValueStack.prototype.insert = ValueArray.prototype.insert;
ValueStack.prototype.insertFromExistValue = ValueArray.prototype.insertFromExistValue;
ValueStack.prototype.insertFromExistElement = ValueArray.prototype.insertFromExistElement;