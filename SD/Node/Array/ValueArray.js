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

ValueArray.prototype.insert = function(idx, value) {
    const elem = value;
    elem._.enter = (elem, move) => {
        elem.attachTo(this.layer("elements"));
        elem.opacity(0);
        move();
        elem.unfreeze();
        elem.freeze();
        elem.startAnimate(this);
        elem.opacity(1);
    };
    this.insertByArrayBase(idx, elem);
    return this;
}

ValueArray.prototype.insertFromExistValue = function(idx, value) {
    const elem = value;
    elem._.enter = (elem, move) => {
        elem.attachTo(this.layer("elements"));
        elem.startAnimate(this);
        move();
        elem.opacity(1);
    };
    this.insertByArrayBase(idx, elem);
    return this;
}

ValueArray.prototype.insertFromExistElement = function(idx, value) {
    return this.insertFromExistValue(idx, value);
}

function update() {
    let x = this.x();
    const y = this.y();
    const elementWidth = this.elementWidth();
    const elementHeight = this.elementHeight();
    const elements = this.member.get("elements");
    for (let element of elements) {
        this.tryMove(() => {
            element.cx(x + elementWidth / 2)
            element.cy(y + elementHeight / 2);
        });
        x += elementWidth;
    }
    return this;
}