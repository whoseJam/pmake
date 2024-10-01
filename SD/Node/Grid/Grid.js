import { Box }             from "@/Node/Element/Box";
import { Enter }           from "@/Node/SDNode/Enter";
import { BaseGrid }        from "@/Node/Grid/BaseGrid";
import { GetterAndSetter } from "@/Node/Common";

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
    this.member.new("main", "row");
    this.member.new("align", "x");

    return this;
}

Grid.prototype = {
    ...BaseGrid.prototype
};

Grid.prototype.x             = GetterAndSetter("x", "setByEqual");
Grid.prototype.y             = GetterAndSetter("y", "setByEqual");
Grid.prototype.elementWidth  = GetterAndSetter("elementWidth", "setByEqual");
Grid.prototype.elementHeight = GetterAndSetter("elementHeight", "setByEqual");
Grid.prototype.axis          = GetterAndSetter("main", "set");
Grid.prototype.align         = GetterAndSetter("align", "set");
Grid.prototype.updateList = [
    ...Grid.prototype.updateList,
    update
]

Grid.prototype.width = function(width) {
    const label = this.member.get("main") === "row" ? "m" : "n";
    if (width === undefined) return this[label]() * this.elementWidth();
    const length = this[label]() ? this[label]() : 1;
    this.elementWidth(width / length);
    return this;
}

Grid.prototype.height = function(height) {
    const label = this.member.get("main") === "row" ? "n" : "m";
    if (height === undefined) return this[label]() * this.elementHeight();
    const length = this[label]() ? this[label]() : 1;
    this.elementHeight(height / length);
    return this;
}

Grid.prototype.insert = function(i, j, value) {
    const element = new Box(this.layer("elements"), value);
    element.onEnter(Enter.Ordinary(this, "elements"));
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
        this.member.hasChanged("elements") ||
        this.member.hasChanged("main") ||
        this.member.hasChanged("align")) {
        const dict = {
            "x": this.x(),
            "y": this.y(),
            "mx": this.mx(),
            "my": this.my(),
            "lx": this.elementWidth(),
            "ly": this.elementHeight()
        };
        const elements = this.member.get("elements");
        const main = this.member.getAndFlush("main");
        const align = this.member.getAndFlush("align");
        const mainAxis = main === "row" ? "y" : "x";
        const auxiAxis = main === "row" ? "x" : "y";
        const auxiFlag = align === "x" || align === "y" ? 1 : -1;
        const auxiLabel = align === "x" || align === "y" ? auxiAxis : `m${auxiAxis}`;
        for (let i = 0; i < elements.length; i++) {
            if (!elements[i]) continue;
            for (let j = 0; j < elements[i].length; j++) {
                const element = elements[i][j];
                this.tryMove(element, () => {
                    element.width(dict["lx"]);
                    element.height(dict["ly"]);    
                    element[mainAxis](dict[mainAxis] + i * dict[`l${mainAxis}`]);
                    element[auxiLabel](dict[auxiLabel] + auxiFlag * j * dict[`l${auxiAxis}`]);
                });
            }
        }
        this.member.flush("x");
        this.member.flush("y");
        this.member.flush("elementWidth");
        this.member.flush("elementHeight");
        this.member.flush("elements");
    }
}