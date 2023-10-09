import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { AbsArray } from "./AbsArray";
import { Rect } from "../Basic/Rect";

export function BarArray(node) {
    let self = {};

    self = Node(self, node);
    self = AbsArray(self);
    self.newLayer("elements");
    self.newLayer("overlay");
    self = Interact(self, self.layer("overlay"));
    
    self.set("elementWidth", 40);
    self.set("identityLength", 40);
    self.set("elements", []);
    self.set("values", []);

    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.elementWidth = elementWidth;
    self.identityLength = identityLength;
    self.push = push;
    self.erase = erase;
    self.update = update;
    self.type = () => { return "BarArray"; };

    self.elementWidth(40);
    self.identityLength(40);
    self.g().attr("name", "BarArray");
   
    return self;
}

function update() {
    let x = this.x();
    let y = this.my();
    let ewidth = this.elementWidth();
    let iheight = this.identityLength();
    let elems = this.get("elements");
    let values = this.get("values");
    for (let i = 0; i < this.length(); i++) {
        let elem = elems[i];
        elem.parent = null;
        elem.width(ewidth);
        elem.height(iheight * values[i]);
        elem.x(x).my(y);
        console.log("MY=", y);
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
    let mxv = 0;
    let values = this.get("values");
    for (let i in values)
        mxv = Math.max(mxv, values[i]);
    if (mxv > 0)
        this.set("identityLength", height / mxv);
}

function elementWidth(width) {
    if (width === undefined)
        return this.get("elementWidth");
    this.set("elementWidth", width);
    this.width(width * this.length());
    return this;
}

function identityLength(length) {
    let olen = this.get("identityLength");
    if (length === undefined)
        return olen;
    this.set("identityLength", length);
    let mxv = 0;
    let values = this.get("values");
    for (let i in values)
        mxv = Math.max(mxv, values[i]);
    this.set("y", this.y() + (length - olen) * mxv); this.call("on_y");
    this.set("height", mxv * length); this.call("on_height");
    this.update();
    return this;
}

function push(value) {
    if (typeof(value) !== "number")
        throw new Error("value must be a number");
    let elem = Rect(this.layer("elements"));
    let elems = this.get("elements");
    let values = this.get("values");
    elems.push(elem);
    values.push(value);
    this.children.push(elem);
    this.preIn()(elem);
    
    let omxv = 0, mxv, len = values.length;
    for (let i = 0; i < len - 1; i++)
        omxv = Math.max(omxv, values[i]);
    mxv = Math.max(omxv, values[len - 1]);
    let ewidth = this.elementWidth(), ilen = this.identityLength();
    let width = this.length() * ewidth;
    let height = ilen * mxv;
    if (mxv > omxv) { this.set("y", this.y() - (mxv - omxv) * ilen); this.call("on_y"); }
    this.set("width", width); this.call("on_width");
    this.set("height", height); this.call("on_height");
    
    this.update();
    this.in()(elem);
    return this;
}

function erase(i) {
    i = this.idx(i);
    let elems = this.get("elements");
    let values = this.get("values");
    let elem = elems[i];
    let omxv = 0, mxv = 0;
    for (let i in values) omxv = Math.max(omxv, values[i]);
    elems.splice(i, 1); values.splice(i, 1);
    for (let i in values) mxv = Math.max(mxv, values[i]);
    this.children.erase(elem);
    this.preOut()(elem);

    let ewidth = this.elementWidth(), ilen = this.identityLength();
    let width = this.length() * ewidth;
    let height = ilen * mxv;
    if (omxv > mxv) { this.set("y", this.y() + (omxv - mxv) * ilen); this.call("on_y"); }
    this.set("width", width); this.call("on_width");
    this.set("height", height); this.call("on_height");

    this.update();
    this.out()(elem);
    return this;
}