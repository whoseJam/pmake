import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { Box } from "../Element/Box";
import { AbsGrid } from "./AbsGrid";

export function SquidGrid(node) {
    let self = {};

    self = Node(self, node, "SquidGrid");
    self = AbsGrid(self);
    self.newLayer("elements");
    self.newLayer("overlay");
    self.newLayer("values");
    self = Interact(self);

    self.set("n", 0);
    self.set("startN", 0);
    self.set("startM", 0);
    self.set("elementWidth", 40);
    self.set("elementHeight", 40);
    self.set("elementType", Box);
    self.set("elements", []);

    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.elementWidth = elementWidth;
    self.elementHeight = elementHeight;
    self.elementType = elementType;
    self.pushRow = pushRow;
    self.n = n;
    self.update = update;

    self.elementWidth(40);
    self.elementHeight(40);

    return self;
}

function elementWidth(width) {
    if (width === undefined)
        return this.get("elementWidth");
    this.set("elementWidth", width);
    let elems = this.get("elements");
    let m = 0;
    for (let i in elems) {
        let row = elems[i];
        m = Math.max(m, row.length);
    }
    this.width(width * m);
    return this;
}

function elementHeight(height) {
    if (height === undefined)
        return this.get("elementHeight");
    this.set("elementHeight", height);
    this.height(height * this.n());
    return this;
}

function elementType(type) {
    if (type === undefined)
        return this.get("elementType");
    this.set("elementType", type);
    return this;
}

function pushRow(m) {
    let elems = this.get("elements");
    let ewidth = this.elementWidth();
    let eheight = this.elementHeight();

    let row = [];
    for (let i = 0; i < m; i++) {
        let elem = this.elementType()(this.layer("elements"));
        this.preIn()(elem);
        elem.x(i * ewidth + this.x());
        elem.y(this.n() * eheight + this.y());
        elem.width(ewidth);
        elem.height(eheight);
        this.in()(elem);

        row.push(elem);
        this.children.push(elem);
    }
    elems.push(row);
    this.set("n", this.n() + 1);
    this.height(this.height() + eheight);
    let width = Math.max(this.width(), m * ewidth);
    this.set("width", width); this.call("onWidth");
    return this;
}

function n(n, m = 1) {
    let on = this.get("n");
    if (n === undefined)
        return on;
    while (on < n) { this.pushRow(m); on++; }
    while (on > n) { this.popRow(); on--; }
    return this;
}

function extWidth(width) {
    let m = 0;
    let elems = this.get("elements");
    for (let i in elems) {
        let row = elems[i];
        m = Math.max(m, row.length);
    }
    if (m > 0) this.set("elementWidth", width / m);
}

function extHeight(height) {
    let div = this.n();
    if (div > 0) this.set("elementHeight", height / div);
}

function update() {
    let x = this.x();
    let y = this.y();
    let ewidth = this.elementWidth();
    let eheight = this.elementHeight();
    let elems = this.get("elements");
    for (let i = 0; i < this.n(); i++) {
        let row = elems[i];
        let len = row.length;
        for (let j = 0; j < len; j++) {
            let elem = row[j];
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