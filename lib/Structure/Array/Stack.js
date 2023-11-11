import { Node } from "../../Node/Node";
import { Text } from "../Basic/Text";
import { AbsArray } from "./AbsArray";
import { Box } from "../Element/Box";
import { Interact } from "../../Interact/Interact";
import { SDHelper } from "../../Utility/SDHelper";

export function Stack(node) {
    let self = {};
    self = Node(self, node, "Stack");
    self = AbsArray(self);
    self.newLayer("elements");
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));
    self._.elementWidth = 40;
    self._.elementHeight = 40;
    self._.width = 40;
    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.elementWidth = elementWidth;
    self.elementHeight = elementHeight;
    self.elementType = SDHelper.keyValueFunc(self, "elementType", Box);
    self.extInsert = extInsert;
    self.extErase = extErase;
    self.update = update;
    self.indexAlign("left");
    return self;
}

function update() {
    let x = this.x();
    let y = this.y();
    let ewidth = this.elementWidth();
    let eheight = this.elementHeight();
    let elems = this._.elements;
    for (let i = 0; i < this.length(); i++) {
        let elem = elems[i];
        elem.parent = null;
        elem.x(x).y(y).width(ewidth).height(eheight);
        elem.parent = this;
        y += eheight;
    }
    this.isDirty = false;
    this.children.update();
}

function extWidth(width) {
    this._.elementWidth = width;
}

function extHeight(height) {
    let div = Math.max(1, this.length());
    this._.elementHeight = height / div;
}

function elementWidth(width) {
    if (width === undefined)
        return this._.elementWidth;
    this._.elementWidth = width;
    this.width(width);
    return this;
}

function elementHeight(height) {
    if (height === undefined)
        return this._.elementHeight;
    this._.elementHeight = height;
    this.height(height * this.length());
    return this;
}

function extInsert() {
    this._.height += this._.elementHeight;
    this.call("onHeight");
}

function extErase() {
    this._.height -= this._.elementHeight;
    this.call("onHeight");
}
