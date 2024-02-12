import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node_";
import { SDHelper } from "../../Utility/SDHelper";
import { Box } from "../Element/Box";
import { AbsGrid } from "./AbsGrid";

export function VarTable(node) {
    let self = {};
    self = Node(self, node, "VarTable");
    self = AbsGrid(self);
    self.newLayer("elements");
    self.newLayer("overlay");
    self.newLayer("values");
    self = Interact(self);
    self._.m = 2; self._.startN = 1;
    self._.elementWidth = 50;
    self._.elementHeight = 30;
    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.extInsert = extInsert;
    self.pushRow = pushRow;
    self.put = put;
    self.find = get;
    self.update = update;
    self.elementWidth(50);
    self.elementHeight(30);
    return self;
}

function extWidth(width) {
    let div = this._.m;
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

function pushRow(key = "", value = "") {
    let elems = this._.elements;
    let n = elems.length;
    let ri = n + this._.startN;
    for (let j = 0; j < this._.m; j++) {
        let rj = j + this._.startM;
        this.insert(ri, rj, (j === 0 ? key : value));
    }
    return this;
}

function put(key, value) {
    key = String(key);
    if (SDHelper.isText(value)) value = String(value);
    let elems = this._.elements;
    let len = elems.length;
    for (let i = 0; i < len; i++) {
        let curKey = elems[i][0].value().text();
        let curValue = elems[i][1].value();
        if (curKey === key) {
            if (curValue.text && SDHelper.isText(value)) {
                if (curValue.text() === value) return;
            }
            elems[i][1].value(value);
            return this;
        }
    }
    this.pushRow(key, value);
    return this;
}

function get(key) {
    key = String(key);
    let elems = this._.elements;
    for (let i = 0; i < elems.length; i++) {
        let curKey = elems[i][0].value().text();
        if (curKey === key) return elems[i][1].value();
    }
    return null;
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