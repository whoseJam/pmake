import { AbsArray } from "./AbsArray";
import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { Box } from "../Element/Box";
import { SDHelper } from "../../Utility/SDHelper";

export function VerticalBloodBar(node) {
    let self = {};
    self = Node(self, node, "VerticalBloodBar");
    self = AbsArray(self);
    self.newLayer("elements");
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));
    self._.elementWidth = 10;
    self._.elementHeight = 10;
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
