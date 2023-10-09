import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { Box } from "../Element/Box";
import { AbsGrid } from "./AbsGrid";

/*
   n/m
-> pushRow/pushCol
-> setN/setM
*/

export function Grid(node) {
    let answ = {};

    answ = Node(answ, node);
    answ = AbsGrid(answ);
    answ.newLayer("elements");
    answ.newLayer("overlay");
    answ.newLayer("values");
    answ = Interact(answ);

    answ.set("n", 0);
    answ.set("m", 0);
    answ.set("startN", 0);
    answ.set("startM", 0);
    answ.set("elementWidth", 40);
    answ.set("elementHeight", 40);
    answ.set("elementType", Box);
    answ.set("elements", []);

    answ.extWidth = extWidth;
    answ.extHeight = extHeight;
    answ.elementWidth = elementWidth;
    answ.elementHeight = elementHeight;
    answ.elementType = elementType;
    answ.pushRow = pushRow;
    answ.pushCol = pushCol;
    answ.n = n;
    answ.m = m;
    answ.update = update;
    answ.type = () => { return "Grid"; };
    
    answ.elementWidth(40);
    answ.elementHeight(40);
    answ.g().attr("name", "Grid");

    return answ;
}

function elementWidth(width) {
    if (width === undefined)
        return this.get("elementWidth");
    this.set("elementWidth", width);
    this.width(width * this.m());
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

function extWidth(width) {
    let div = this.m();
    if (div > 0) this.set("elementWidth", width / div);
}

function extHeight(height) {
    let div = this.n();
    if (div > 0) this.set("elementHeight", height / div);
}

function pushRow() {
    let elems = this.get("elements");
    let ewidth = this.elementWidth();
    let eheight = this.elementHeight();

    let row = [];
    for (let i = 0; i < this.m(); i++) {
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
    return this;
}

function pushCol() {
    let elems = this.get("elements");
    let ewidth = this.elementWidth();
    let eheight = this.elementHeight();

    for (let i = 0; i < this.n(); i++) {
        let elem = this.elementType()(this.layer("elements"));
        this.preIn()(elem);
        elem.x(this.m() * ewidth + this.x());
        elem.y(i * eheight + this.y());
        elem.width(ewidth);
        elem.height(eheight);
        this.in()(elem);

        elems[i].push(elem);
        this.children.push(elem);
    }
    this.set("m", this.m() + 1);
    this.width(this.width() + ewidth);
    return this;
}

function n(n) {
    let on = this.get("n");
    if (n === undefined)
        return on;
    while (on < n) { this.pushRow(); on++; }
    while (on > n) { this.popRow(); on--; }
    return this;
}

function m(m) {
    let om = this.get("m");
    if (m === undefined)
        return om;
    while (om < m) { this.pushCol(); om++; }
    while (om > m) { this.pusCol(); om--; }
    return this;
}

function update() {
    let x = this.x();
    let y = this.y();
    let ewidth = this.elementWidth();
    let eheight = this.elementHeight();
    let elems = this.get("elements");
    for (let i = 0; i < this.n(); i++) {
        for (let j = 0; j < this.m(); j++) {
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