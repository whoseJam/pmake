import { Array } from "@/Node/Array/Array";

export function ValueArray(parent) {
    Array.call(this, parent);

    this.g().type("ValueArray");

    return this;
}

ValueArray.prototype = {
    ...Array.prototype
};

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
        element.unfreeze().freeze();
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
    console.log("insert form exist element(ValueArray)");
    return this.insertFromExistValue(index, value);
}

function update() {
    if (this.member.hasChanged("x") ||
        this.member.hasChanged("y") ||
        this.member.hasChanged("elementWidth") ||
        this.member.hasChanged("elementHeight") ||
        this.member.hasChanged("elements")) {
        let x = this.x();
        const y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this.member.get("elements");
        for (let element of elements) {
            this.tryMove(element, () => {
                element.cx(x + elementWidth / 2)
                element.cy(y + elementHeight / 2);
            });
            x += elementWidth;
        }
    }
}