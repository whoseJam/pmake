import { AbsArray } from "./AbsArray";
import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { Text } from "../Basic/Text";
import { Box } from "../Element/Box";
import { SDHelper } from "../../Utility/SDHelper";

export function Array(node) {
    let self = {};

    self = Node(self, node, "Array");
    self = AbsArray(self);
    self.newLayer("elements");
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));

    self.set("elementWidth", 40);
    self.set("elementHeight", 40);

    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.elementWidth = elementWidth;
    self.elementHeight = elementHeight;
    self.elementType = SDHelper.keyValueFunc(self, "elementType", Box);
    self.extInsert = extInsert;
    self.extErase = extErase;
    self.update = update;
    
    self.elementWidth(40);
    self.elementHeight(40);
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

function extInsert(i, value = null) {
    value = SDHelper.any2Slide(this, value);

    let elem = this._.elementType(this.layer("elements"));
    let elems = this._.elements;
    elems.splice(this.idx(i), 0, elem.value(value));
    this.children.push(elem);
    this._.preIn(elem);
    this.update();
    this._.in(elem);

    this._.width += this._.elementWidth;
    this.call("onWidth"); this.call("onHeight");
    return this;
}

function extErase(i) {
    let elem = this.element(i);
    let elems = this._.elements;
    elems.splice(this.idx(i), 1);
    this.children.erase(elem);
    this._.preOut(elem);
    this.update();
    this._.out(elem);

    this._.width -= this._.elementWidth;
    this.call("onWidth");
    return this;
}
