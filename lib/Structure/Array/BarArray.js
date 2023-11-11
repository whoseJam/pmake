import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { AbsArray } from "./AbsArray";
import { Rect } from "../Basic/Rect";

export function BarArray(node) {
    let self = {};
    self = Node(self, node, "BarArray");
    self = AbsArray(self);
    self.newLayer("elements");
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));
    self._.elementWidth = 40;
    self._.identityLength = 40;
    self._.bars = [];
    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.elementWidth = elementWidth;
    self.identityLength = identityLength;
    self.extInsert = extInsert;
    self.extErase = extErase;
    self.update = update;
    self.indexAlign("bottom");
    return self;
}

function update() {
    let x = this.x();
    let y = this.my();
    let ewidth = this.elementWidth();
    let iheight = this.identityLength();
    let elems = this._.elements;
    let bars = this._.bars;
    for (let i = 0; i < this.length(); i++) {
        let elem = bars[i];
        elem.parent = null;
        elem.width(ewidth);
        elem.height(iheight * elems[i]);
        elem.x(x).my(y);
        elem.parent = this;
        x += ewidth;
    }
    this.isDirty = false;
    this.children.update();
    return this;
}

function extWidth(width) {
    let div = Math.max(1, this.length());
    this._.elementWidth = width / div;
}

function extHeight(height) {
    let mxv = 0;
    let elems = this._.elements;
    for (let i = 0; i < elems.length; i++)
        mxv = Math.max(mxv, elems[i]);
    if (mxv > 0) this._.identityLength = height / mxv;
}

function elementWidth(width) {
    if (width === undefined)
        return this._.elementWidth;
    this._.elementWidth = width;
    this.width(width * this.length());
    return this;
}

function identityLength(length) {
    let olen = this._.identityLength;
    if (length === undefined)
        return olen;
    this._.identityLength = length;
    let mxv = 0;
    let elems = this._.elements;
    for (let i = 0; i < elems.length; i++)
        mxv = Math.max(mxv, elems[i]);
    this._.y += (length - olen) * mxv; this.call("onY");
    this._.height = mxv * length; this.call("onHeight");
    this.update();
    return this;
}

function extInsert(i, value) {
    if (typeof(value) !== "number")
        throw new Error("value must be a number");
    let elem = Rect(this.layer("elements"));
    let values = this._.elements;
    this._.bars.splice(this.idx(i), 0, elem);
    this.children.push(elem);
    
    let omxv = 0, mxv, len = values.length;
    for (let i = 0; i < len - 1; i++)
        omxv = Math.max(omxv, values[i]);
    mxv = Math.max(omxv, values[len - 1]);
    let ewidth = this.elementWidth(), ilen = this.identityLength();
    if (mxv > omxv) { this._.y -= (mxv - omxv) * ilen; this.call("onY"); }
    this._.width = this.length() * ewidth; this.call("onWidth");
    this._.height = ilen * mxv; this.call("onHeight");
    
    this.update();
    elem.opacity(0);
    elem.startAnimate(this);
    elem.opacity(1);
    return this;
}

function extErase(i) {
    i = this.idx(i);
    let elems = this._.bars;
    let values = this._.elements;
    let elem = elems[i];
    let omxv = 0, mxv = 0;
    for (let i in values) omxv = Math.max(omxv, values[i]);
    elems.splice(i, 1);
    for (let i in values) mxv = Math.max(mxv, values[i]);
    this.children.erase(elem);

    let ewidth = this.elementWidth(), ilen = this.identityLength();
    if (omxv > mxv) { this._.y += (omxv - mxv) * ilen; this.call("onY"); }
    this._.width = this.length() * ewidth; this.call("onWidth");
    this._.height = ilen * mxv; this.call("onHeight");

    this.update();
    elem.opacity(0).remove();
    return this;
}