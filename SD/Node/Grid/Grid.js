import { Box }                  from "@/Node/Element/Box";
import { BaseGrid }             from "@/Node/Grid/BaseGrid";
import { naiveGetterAndSetter } from "@/Node/Common";

export function Grid(parent) {
    BaseGrid.call(this, parent);

    this.g().type("Grid");
    this.newLayer("elements");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("elementWidth", 40);
    this.member.new("elementHeight", 40);
    this.member.new("width", 0);
    this.member.new("height", 0);

    return this;
}

Grid.prototype = {
    ...BaseGrid.prototype
};

Grid.prototype.x             = naiveGetterAndSetter("x", "setByEqual");
Grid.prototype.y             = naiveGetterAndSetter("y", "setByEqual");
Grid.prototype.elementWidth  = naiveGetterAndSetter("elementWidth", "setByEqual");
Grid.prototype.elementHeight = naiveGetterAndSetter("elementHeight", "setByEqual");
Grid.prototype.updateList = [
    ...Grid.prototype.updateList,
    update
]

Grid.prototype.width = function(width) {
    if (width === undefined) {
        return this.m() * this.elementWidth();
    }
    const n = this.n() ? this.n() : 1;
    this.elementWidth(width / n);
    return this;
}

Grid.prototype.height = function(height) {
    if (height === undefined) {
        return this.n() * this.elementHeight();
    }
    const m = this.m() ? this.m() : 1;
    this.elementHeight(height / m);
    return this;
}

Grid.prototype.insert = function(i, j, value) {
    const element = new Box(this.layer("elements"), value);
    element._.enter = (element, move) => {
        element.opacity(0);
        move();
        element.unfreeze().freeze();
        element.startAnimate(this)
        element.opacity(1);
    };
    this.insertByBaseGrid(i, j, element);
    return this;
}


Grid.prototype.erase = function(i, j) {
    const element = this.element(i, j);
    element.startAnimate(this).opacity(0).remove();
    this.eraseByBaseGrid(i, j);
    return this;
}

function update() {
    if (this.member.hasChanged("x") ||
        this.member.hasChanged("y") ||
        this.member.hasChanged("elementWidth") ||
        this.member.hasChanged("elementHeight") ||
        this.member.hasChanged("elements")) {
        const x = this.x();
        const y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this.member.get("elements");
        for (let i = 0; i < elements.length; i++) {
            if (!elements[i]) continue;
            for (let j = 0; j < elements[i].length; j++) {
                const element = elements[i][j];
                this.tryMove(element, () => {
                    element.width(elementWidth);
                    element.height(elementHeight);
                    element.x(x + j * elementWidth)
                    element.y(y + i * elementHeight);
                });
            }
        }
    }
}