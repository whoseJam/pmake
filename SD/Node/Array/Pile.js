import { Array }     from "@/Node/Array/Array";
import { SDNode }    from "@/Node/SDNode";
import { BaseArray } from "@/Node/Array/BaseArray";

export function Pile(parent) {
    BaseArray.call(this, parent);

    this.type("Pile");
    this.newLayer("elements");

    this.member.new("x", 0);
    this.member.new("my", 0);
    this.member.new("elementWidth", 40);
    this.member.new("elementHeight", 40);
}

Pile.prototype = {
    ...BaseArray.prototype
};

Pile.prototype.y = function(y) {
    if (y === undefined) return this.my() - this.height();
    this.my(y + this.height());
    return this;
}

Pile.prototype.my            = SDNode.OrdinaryGSet("my", "setByEqual");
Pile.prototype.elementWidth  = SDNode.OrdinaryGSet("elementWidth", "setByEqual");
Pile.prototype.elementHeight = SDNode.OrdinaryGSet("elementHeight", "setByEqual");
Pile.prototype.insert                 = Array.prototype.insert;
Pile.prototype.insertFromExistValue   = Array.prototype.insertFromExistValue;
Pile.prototype.insertFromExistElement = Array.prototype.insertFromExistElement;
Pile.prototype.updateList = [
    ...Pile.prototype.updateList,
    update
];

Pile.prototype.width = function(width) {
    return this.elementWidth(width);
}

Pile.prototype.height = function(height) {
    if (height === undefined) return this.elementHeight() * this.length();
    const length = Math.max(this.length(), 1);
    this.elementHeight(height / length);
    return this;
}

function update() {
    if (this.member.hasChanged("x") ||
        this.member.hasChanged("my") ||
        this.member.hasChanged("elementWidth") ||
        this.member.hasChanged("elementHeight") ||
        this.member.hasChanged("elements")) {
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const x = this.x();
        let y = this.my() - elementHeight;
        const elements = this.member.get("elements");
        for (let element of elements) {
            this.tryMove(element, () => {
                element.width(elementWidth);
                element.height(elementHeight);
                element.x(x).y(y);
            });
            y -= elementHeight;
        }
        this.member.flush("x");
        this.member.flush("my");
        this.member.flush("elementWidth");
        this.member.flush("elementHeight");
        this.member.flush("elements");
    }
}