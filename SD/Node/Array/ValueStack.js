import { Stack } from "@/Node/Array/Stack";
import { ValueArray } from "@/Node/Array/ValueArray";
import { SDNode } from "@/Node/SDNode";

export function ValueStack(parent) {
    Stack.call(this, parent);

    this.type("ValueStack");

    this.member.new("align", "cx");

    return this;
}

ValueStack.prototype = {
    ...Stack.prototype
};

ValueStack.prototype.updateList = [
    ...ValueStack.prototype.updateList.slice(0, -1),
    update
];

ValueStack.prototype.align                  = SDNode.OrdinaryGSet("align", "set");
ValueStack.prototype.insert                 = ValueArray.prototype.insert;
ValueStack.prototype.insertFromExistValue   = ValueArray.prototype.insertFromExistValue;
ValueStack.prototype.insertFromExistElement = ValueArray.prototype.insertFromExistElement;

function update() {
    if (this.member.hasChanged("x") ||
        this.member.hasChanged("y") ||
        this.member.hasChanged("elementWidth") ||
        this.member.hasChanged("elementHeight") ||
        this.member.hasChanged("elements") ||
        this.member.hasChanged("align")) {
        let y = this.y();
        const align = this.align();
        const x = this[align]();
        const elementHeight = this.elementHeight();
        const elements = this.member.get("elements");
        for (let element of elements) {
            this.tryMove(element, () => {
                element[align](x);
                element.cy(y + elementHeight / 2);
            });
            y += elementHeight;
        }
        this.member.flush("x");
        this.member.flush("y");
        this.member.flush("elementWidth");
        this.member.flush("elementHeight");
        this.member.flush("elements");
        this.member.flush("align");
    }
}