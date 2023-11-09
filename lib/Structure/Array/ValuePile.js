import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { AbsArray } from "./AbsArray";

export function ValuePile(node) {
    let self = {};

    self = Node(self, node, "ValuePile");
    self = AbsArray(self);
    self.newLayer("elements");
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));

    self.extWidth = () => {};
    self.extHeight = () => {};
    self.extInsert = insert;
    self.extErase = erase;
    self.update = update;
    
    self.indexAlign("left");

    return self;
}

function update() {
    let x = this.x();
    let y = this.y();
    let elems = this.get("elements");
    let ow = 0, width = this.width();
    let oh = 0, height = this.height();
    for (let i = 0; i < this.length(); i++) {
        ow = Math.max(ow, elems[i].width());
        oh += elems[i].height();
    }
    for (let i = 0; i < this.length(); i++) {
        elems[i].parent = null;
        if (oh > 0) { let h = elems[i].height() * height / oh; elems[i].height(h); } 
        if (ow > 0) { let w = elems[i].width() * width / ow; elems[i].width(w); }
        elems[i].parent = this;
    }
    for (let i = 0; i < this.length(); i++) {
        let elem = elems[i];
        elem.parent = null;
        elem.x(x).y(y);
        elem.parent = this;
        y = elem.my();
    }
    this.isDirty = false;
    this.children.update();
}

function insert(i, value = null) {
    if (!value) throw new Error("invalid value");

    value.attachTo(this.layer("elements"));
    let elems = this.get("elements");
    elems.splice(this.idx(i), 0, value);
    this.children.push(value);
    this.preIn()(value);

    let y = this.y() - value.height();
    let width = Math.max(this.width(), value.width())
    let height = this.height() + value.height();
    this.set("y", y); this.call("onY");
    this.set("width", width); this.call("onWidth");
    this.set("height", height); this.call("onHeight");

    this.update();
    this.in()(value);

    return this;
}

function erase() {
    throw new Error("TODO");
}