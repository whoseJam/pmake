import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node_";
import { AbsGrid } from "./AbsGrid";

export function Grid(node) {
    let self = {};
    self = Node(self, node, "Grid");
    self = AbsGrid(self);
    self.newLayer("elements");
    self.newLayer("overlay");
    self.newLayer("values");
    self = Interact(self);
    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.extInsert = extInsert;
    self.update = update;
    self.elementWidth(40);
    self.elementHeight(40);
    return self;
}

function extWidth(width) {
    let div = this.m();
    if (div > 0) this.set("elementWidth", width / div);
}

function extHeight(height) {
    let div = this.n();
    if (div > 0) this.set("elementHeight", height / div);
}

function extInsert() {
    this._.width = this.m() * this.elementWidth();
    this._.height = this.n() * this.elementHeight();
    this.call("onWidth");
    this.call("onHeight");
}

function update() {
    let x = this.x();
    let y = this.y();
    let ewidth = this.elementWidth();
    let eheight = this.elementHeight();
    let elems = this.get("elements");
    for (let i = 0; i < elems.length; i++) {
        for (let j = 0; j < elems[i].length; j++) {
            let elem = elems[i][j];
            elem.parent = null;
            elem.x(x + j * ewidth);
            elem.y(y + i * eheight);
            elem.width(ewidth);
            elem.height(eheight);
            elem.parent = this;
        }
    }
    this.isDirty = false;
    this.children.update();
    return this;
}