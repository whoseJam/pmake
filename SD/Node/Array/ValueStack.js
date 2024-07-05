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

ValueStack.prototype.insert = function(idx, value) {
    const insert = ValueArray.prototype.insert;
    insert.call(this, idx, value);
    return this;
}

ValueStack.prototype.insertFromExistValue = function(idx, value) {
    const insertFromExistValue = ValueArray.prototype.insertFromExistValue;
    insertFromExistValue.call(this, idx, value);
    return this;
}

ValueStack.prototype.insertFromExistElement = function(idx, value) {
    return this.insertFromExistValue(idx, value);
}

function update() {
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
    return this;
}