import { Stack } from "@/Node/Array/Stack";
import { ValueArray } from "@/Node/Array/ValueArray";

export function ValueStack(parent) {
    Stack.call(this, parent);

    this.g().type("ValueStack");

    return this;
}

ValueStack.prototype = {
    ...Stack.prototype
};

ValueStack.prototype.updateList = [
    ...ValueStack.prototype.updateList.slice(0, -1),
    update
];

ValueStack.prototype.insert                 = ValueArray.prototype.insert;
ValueStack.prototype.insertFromExistValue   = ValueArray.prototype.insertFromExistValue;
ValueStack.prototype.insertFromExistElement = ValueArray.prototype.insertFromExistElement;

function update() {
    if (this.member.hasChanged("x") ||
        this.member.hasChanged("y") ||
        this.member.hasChanged("elementWidth") ||
        this.member.hasChanged("elementHeight")) {
        const x = this.x();
        let y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this.member.get("elements");
        for (let element of elements) {
            this.tryMove(element, () => {
                element.cx(x + elementWidth / 2);
                element.cy(y + elementHeight / 2);
            });
            y += elementHeight;
        }
    }
}