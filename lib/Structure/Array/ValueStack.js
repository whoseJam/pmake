import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { SDHelper } from "../../Utility/SDHelper";
import { AbsArray } from "./AbsArray";

export function ValueStack(node) {
    let self = {};
    self = Node(self, node, "ValueStack");
    self = AbsArray(self);
    self.newLayer("elements");
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));
    self.extWidth = SDHelper.emptyFunc;
    self.extHeight = SDHelper.emptyFunc;
    self.extInsert = extInsert;
    self.extErase = extErase;
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
    return this;
}

function extInsert(i, elem) {
    this._.width = Math.max(this._.width, elem.width());
    this.call("onWidth");
    this._.height += elem.height();
    this.call("onHeight");
}

function extErase(i, elem) {
    let elems = this._.elements;
    this._.width = 0;
    for (let i = 0; i < elems.length; i++)
        this._.width = Math.max(this._.width, elems[i].width());
    this.call("onWidth");
    this._.height -= elem.height();
    this.call("onHeight");
    return this;
}