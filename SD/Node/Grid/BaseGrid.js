import { naiveGetterAndSetter } from "../Common";
import { SDNode } from "../SDNode";

export function BaseGrid(parent) {
    SDNode.call(this, parent);

    this.member.new("n", 0);
    this.member.new("m", 0);
    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("startN", 0);
    this.member.new("startM", 0);
    this.member.new("elements", []);

    return this;
}

BaseGrid.prototype = {
    ...SDNode.prototype
};

BaseGrid.prototype.startN = naiveGetterAndSetter("startN", "set");
BaseGrid.prototype.startM = naiveGetterAndSetter("startM", "set");

BaseGrid.prototype.endN = function() {
    return this.startN() + this.n() - 1;
}

BaseGrid.prototype.endM = function(idx) {
    if (idx === undefined) return this.startM() + this.m() - 1;
    let elems = this.member.get("elements");
    return this.startM() + elems[this.idxN(idx)].length - 1;
}

BaseGrid.prototype.idxN = function(idx) {
    return idx - this.startN();
}

BaseGrid.prototype.idxM = function(idx) {
    return idx - this.startM();
}

BaseGrid.prototype.n = function(n) {
    let on = this.member.get("n");
    if (n === undefined) return on;
    while (on < n) { this.pushRow(); on++; }
    while (on > n) { this.popRow(); on--; }
    return this;
}

BaseGrid.prototype.m = function(m) {
    let om = this.member.get("m");
    if (m === undefined) return om;
    while (om < m) { this.pushCol(); om++; }
    while (om > m) { this.popCol(); om--; }
    return this;
}

BaseGrid.prototype.getM = function(idx) {
    return this.endM() - this.startM() + 1;
}

BaseGrid.prototype.insertByBaseGrid = function(i, j, element) {
    const ri = this.idxN(i);
    const rj = this.idxM(j);
    const elements = this.member.get("elements");
    while (elements.length <= ri) {
        elements.push([]);
    }
    elements[ri].splice(rj, 0, element);
    this.children.push(element);
    this.member.set("n", Math.max(ri + 1, this.member.get("n")));
    this.member.set("m", Math.max(rj + 1, this.member.get("m")));
    this.member.dirty("elements");
    this.tryUpdate();
    return this;
}

BaseGrid.prototype.eraseByBaseGrid = function(i, j) {
    const element = this.element(i, j);
    const ri = this.idxN(i);
    const rj = this.idxM(j);
    const elements = this.member.get("elements");
    elements[ri].splice(rj, 1);
    this.children.erase(element);
    this.member.dirty("elements");
    this.tryUpdate();
    return this;
}

BaseGrid.prototype.pushCol = function(rows) {
    let l = this.startN();
    let r = (rows === undefined) ? this.endN() : l + rows - 1;
    for (let i = l; i <= r; i++) {
        this.insert(i, this.endM(i) + 1, null);
    }
    if (l > r) { this._.m++; }
    return this;
}

BaseGrid.prototype.pushRow = function(cols) {
    let n = this.endN() + 1;
    let l = this.startM();
    let r = (cols === undefined) ? this.endM() : l + cols - 1;
    for (let j = l; j <= r; j++)
        this.insert(n, j, null);
    if (l > r) {
        this.member.set("n", this.member.get("n") + 1);
        this.member.get("elements").push([]);
    }
    return this;
}

BaseGrid.prototype.element = function(i, j) {
    let elems = this.member.get("elements");
    return elems[this.idxN(i)][this.idxM(j)];
}

BaseGrid.prototype.value = function() {
    if (arguments.length === 2) return value2.apply(this, arguments);
    if (arguments.length === 3) return value3.apply(this, arguments);
    console.log(arguments);
    throw new Error("无效的参数")
}

BaseGrid.prototype.intValue = function(x, y) {
    let value = this.value(x, y);
    if (!value) return 0;
    return +value.text();
}

BaseGrid.prototype.opacity = function() {
    if (arguments.length === 0) return SDNode.prototype.opacity.call(this);
    if (arguments.length === 1) {
        SDNode.prototype.opacity.call(this, arguments[0]);
        return this;
    }
    if (arguments.length === 2) return opacity2.apply(this, arguments);
    if (arguments.length === 3) return opacity3.apply(this, arguments);
    console.log(arguments);
    throw new Error("无效的参数");
}

BaseGrid.prototype.color = function() {
    if (arguments.length === 1) return color1.apply(this, arguments);
    if (arguments.length === 2) return color2.apply(this, arguments);
    if (arguments.length === 3) return color3.apply(this, arguments);
    console.log(arguments);
    throw new Error("无效的参数");
}

function value2(i, j) {
    let elem = this.element(i, j);
    return elem.value();
}
function value3(i, j, value) {
    let elem = this.element(i, j);
    elem.value(value);
    return this;
}

function opacity2(i, j) {
    let elem = this.element(i, j);
    return elem.opacity();
}
function opacity3(i, j, opacity) {
    let elem = this.element(i, j);
    elem.opacity(opacity);
    return this;
}

function color1(col) {
    let elems = this.member.get("elements");
    for (let i = 0; i < elems.length; i++)
        for (let j = 0; j < elems[i].length; j++)
            elems[i][j].color(col);
    return this;
}
function color2(i, j) {
    let elem = this.element(i, j);
    return elem.color();
}
function color3(i, j, col) {
    let elem = this.element(i, j);
    elem.color(col);
    return this;
}