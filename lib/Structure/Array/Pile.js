import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { AbsArray } from "./AbsArray";
import { Box } from "../Element/Box";
import { SDHelper } from "../../Utility/SDHelper";

export function Pile(node) {
    let self = {};

    self = Node(self, node, "Pile");
    self = AbsArray(self);
    self.newLayer("elements");
    self.newLayer("overlay");
    self.newLayer("values");
    self = Interact(self, self.layer("overlay"));

    self.set("elementWidth", 40);
    self.set("elementHeight", 40);

    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.elementWidth = elementWidth;
    self.elementHeight = elementHeight;
    self.elementType = SDHelper.keyValueFunc(self, "elementType", Box);
    self.insert = insert;
    self.erase = erase;
    self.update = update;

    self.elementWidth(40);
    self.elementHeight(40);

    return self;
}

function update() {
    let x = this.x();
    let y = this.y();
    let ewidth = this.elementWidth();
    let eheight = this.elementHeight();
    let elems = this.get("elements");
    for (let i = this.length() - 1; i >= 0; i--) {
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
    this.set("elementWidth", width);
}

function extHeight(height) {
    let div = Math.max(1, this.length());
    this.set("elementHeight", height / div);
}

function elementWidth(width) {
    if (width === undefined)
        return this.get("elementWidth");
    this.set("elementWidth", width);
    this.width(width);
    return this;
}

function elementHeight(height) {
    if (height === undefined)
        return this.get("elementHeight");
    this.set("elementHeight", height);
    this.height(height * this.length());
    return this;
}

function insert(i, value = null) {
    value = SDHelper.any2Slide(this.layer("values"), value);
    
    let elem = this.elementType()(this.layer("elements"));
    let elems = this.get("elements");
    elems.splice(this.idx(i), 0, elem.value(value));
    this.children.push(elem);

    this._.y -= this._.elementHeight; this.call("onY");
    this._.height += this._.elementHeight; this.call("onHeight");

    this.preIn()(elem);
    this.update();
    this.in()(elem);
    return this;
}

function erase(i) {
    let elem = this.element(i);
    let elems = this.get("elements");
    elems.splice(this.idx(i), 1);
    this.children.erase(elem);
    
    this._.y += this._.elementHeight; this.call("onY");
    this._.height -= this._.elementHeight; this.call("onHeight");

    this.preOut()(elem);
    this.update();
    this.out()(elem);
    return this;
}
