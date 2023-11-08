import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
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

    self.set("n", 0);
    self.set("m", 2);
    self.set("startN", 1);
    self.set("startM", 0);
    self.set("elementWidth", 50);
    self.set("elementHeight", 30);
    self.set("elements", []);

    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.elementWidth = elementWidth;
    self.elementHeight = elementHeight;
    self.elementType = SDHelper.keyValueFunc(self, "elementType", Box);
    self.pushRow = pushRow;
    self.n = n;
    self.put = put;
    self.find = get;
    self.update = update;

    self.elementWidth(50);
    self.elementHeight(30);

    return self;
}

function elementWidth(width) {
    if (width === undefined)
        return this.get("elementWidth");
    this.set("elementWidth", width);
    this.width(width * this._.m);
    return this;
}

function elementHeight(height) {
    if (height === undefined)
        return this.get("elementHeight");
    this.set("elementHeight", height);
    this.height(height * this.n());
    return this;
}

function extWidth(width) {
    let div = this._.m;
    if (div > 0) this.set("elementWidth", width / div);
}

function extHeight(height) {
    let div = this.n();
    if (div > 0) this.set("elementHeight", height / div);
}

function pushRow(key = "", value = "") {
    let elems = this.get("elements");
    let ewidth = this.elementWidth();
    let eheight = this.elementHeight();

    let row = [];
    for (let i = 0; i < this._.m; i++) {
        let elem = this.elementType()(this.layer("elements"));
        this.preIn()(elem);
        elem.x(i * ewidth + this.x());
        elem.y(this.n() * eheight + this.y());
        elem.width(ewidth);
        elem.height(eheight);
        elem.value(i === 0 ? key : value);
        this.in()(elem);

        row.push(elem);
        this.children.push(elem);
    }
    elems.push(row);
    this.set("n", this.n() + 1);
    this.height(this.height() + eheight);
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

function n(n) {
    let on = this.get("n");
    if (n === undefined)
        return on;
    while (on < n) { this.pushRow(); on++; }
    while (on > n) { this.popRow(); on--; }
    return this;
}

function update() {
    let x = this.x();
    let y = this.y();
    let ewidth = this.elementWidth();
    let eheight = this.elementHeight();
    let elems = this.get("elements");
    for (let i = 0; i < this.n(); i++) {
        for (let j = 0; j < this._.m; j++) {
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