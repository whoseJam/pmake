import { BaseGrid } from "./BaseGrid";
import { Box } from "../Element/Box";
import { naiveGetterAndSetter } from "../Common";

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
        return this.member.get("width");
    }
    const n = this.n() ? this.n() : 1;
    this.elementWidth(width / n);
    return this;
}

Grid.prototype.height = function(height) {
    if (height === undefined) {
        return this.member.get("height");
    }
    const m = this.m() ? this.m() : 1;
    this.elementHeight(height / m);
    return this;
}

Grid.prototype.insert = function(i, j, value = null) {
    let elem = new Box(this.layer("elements"), value);
    this.insertByBaseGrid(i, j, elem);
    this.member.set("width", this.elementWidth() * this.m());
    this.member.set("height", this.elementHeight() * this.n());
    elem._.enter = (elem, move) => {
        elem.opacity(0);
        move();
        elem.unfreeze();
        elem.freeze();
        elem.startAnimate(this).opacity(1);
    };
    this.tryUpdate();
    return this;
}


Grid.prototype.erase = function(i, j) {
    let elem = this.element(i, j);
    this.eraseByBaseGrid(i, j);
    this.member.set("width", this.elementWidth() * this.m());
    this.member.set("height", this.elementHeight() * this.n());
    elem.startAnimate(this).opacity(0).remove();
    this.tryUpdate();
    return this;
}

function update() {
    const x = this.x();
    const y = this.y();
    const elementWidth = this.elementWidth();
    const elementHeight = this.elementHeight();
    const elements = this.member.get("elements");
    for (let i = 0; i < elements.length; i++) {
        if (!elements[i]) continue;
        for (let j = 0; j < elements[i].length; j++) {
            const element = elements[i][j];
            const locx = x + j * elementWidth;
            const locy = y + i * elementHeight;
            this.tryMove(element, () => {
                element.width(elementWidth);
                element.height(elementHeight);
                element.x(locx).y(locy);
            });
        }
    }
}