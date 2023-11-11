import { AbsArray } from "./AbsArray";
import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { Text } from "../Basic/Text";
import { Box } from "../Element/Box";
import { SDHelper } from "../../Utility/SDHelper";
import { svg } from "../../slide";

export function Array(node) {
    let self = {};
    self = Node(self, node, "Array");
    self = AbsArray(self);
    self.newLayer("elements");
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));
    self._.elementWidth = 40;
    self._.elementHeight = 40;
    self._.height = 40;
    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.elementWidth = elementWidth;
    self.elementHeight = elementHeight;
    self.elementType = SDHelper.keyValueFunc(self, "elementType", Box);
    self.extInsert = extInsert;
    self.extErase = extErase;
    self.update = update;
    self.indexAlign("top");
    return self;
}

function update() {
    let x = this.x();
    let y = this.y();
    let ewidth = this.elementWidth();
    let eheight = this.elementHeight();
    let elems = this.get("elements");
    for (let i = 0; i < this.length(); i++) {
        let elem = elems[i];
        elem.parent = null;
        elem.x(x).y(y).width(ewidth).height(eheight);
        elem.parent = this;
        x += ewidth;
    }
    this.isDirty = false;
    this.children.update();
    return this;
}

function extWidth(width) {
    let div = Math.max(1, this.length());
    this.set("elementWidth", width / div);
}

function extHeight(height) {
    this.set("elementHeight", height);
}

function elementWidth(width) {
    if (width === undefined)
        return this.get("elementWidth");
    this.set("elementWidth", width);
    this.width(width * this.length());
    return this;
}

function elementHeight(height) {
    if (height === undefined)
        return this.get("elementHeight");
    this.set("elementHeight", height);
    this.height(height);
    return this;
}

function extInsert() {
    this._.width += this._.elementWidth;
    this.call("onWidth"); this.call("onHeight");
}

function extErase() {
    this._.width -= this._.elementWidth;
    this.call("onWidth");
}
