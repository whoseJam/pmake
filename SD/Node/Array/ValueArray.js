import { Array }           from "@/Node/Array/Array";
import { GetterAndSetter } from "@/Node/Common";

export function ValueArray(parent) {
    Array.call(this, parent);

    this.g().type("ValueArray");

    this.member.new("align", "cy");

    return this;
}

ValueArray.prototype = {
    ...Array.prototype
};

ValueArray.prototype.align = GetterAndSetter("align", "set");

ValueArray.prototype.updateList = [
    ...Array.prototype.updateList.slice(0, -1),
    update
];

ValueArray.prototype.insert = function(index, value) {
    const element = value;
    element._.enter = (element, move) => {
        element.attachTo(this.layer("elements"));
        element.opacity(0);
        move();
        element.update();
        element.startAnimate(this);
        element.opacity(1);
    };
    this.insertByBaseArray(index, element);
    return this;
}

ValueArray.prototype.insertFromExistValue = function(index, value) {
    const element = value;
    element._.enter = (element, move) => {
        element.attachTo(this.layer("elements"));
        element.startAnimate(this);
        move();
        element.opacity(1);
    };
    this.insertByBaseArray(index, element);
    return this;
}

ValueArray.prototype.insertFromExistElement = function(index, value) {
    return this.insertFromExistValue(index, value);
}

function update() {
    if (this.member.hasChanged("x") ||
        this.member.hasChanged("y") ||
        this.member.hasChanged("elementWidth") ||
        this.member.hasChanged("elementHeight") ||
        this.member.hasChanged("elements") ||
        this.member.hasChanged("align")) {
        let x = this.x();
        const align = this.align();
        const y = this[align]();
        const elementWidth = this.elementWidth();
        const elements = this.member.get("elements");
        for (let element of elements) {
            this.tryMove(element, () => {
                element.cx(x + elementWidth / 2)
                element[align](y);
            });
            x += elementWidth;
        }
        this.member.flush("x");
        this.member.flush("y");
        this.member.flush("elementWidth");
        this.member.flush("elementHeight");
        this.member.flush("elements");
        this.member.flush("align");
    }
}