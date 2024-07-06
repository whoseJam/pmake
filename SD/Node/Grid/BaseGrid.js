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

/**
 * 将一个elem插入到网格第i,j位置上，并将elem记录为当前节点的子节点
 * @param {number} i 
 * @param {number} j 
 * @param {SDNode} elem 
 * @returns 当前节点
 */
BaseGrid.prototype.insertByBaseGrid = function(i, j, elem) {
    let ri = this.idxN(i);
    let rj = this.idxM(j);
    let elems = this.member.get("elements");
    while (elems.length <= ri) elems.push([]);
    elems[ri].splice(rj, 0, elem);
    this.children.push(elem);
    this.member.set("n", Math.max(ri + 1, this.member.get("n")));
    this.member.set("m", Math.max(rj + 1, this.member.get("m")));
    this.tryUpdate();
    return this;
}

BaseGrid.prototype.eraseByBaseGrid = function(i, j) {
    let elem = this.element(i, j);
    let ri = this.idxN(i);
    let rj = this.idxM(j);
    let elems = this.member.get("elements");
    elems[ri].splice(rj, 1);
    this.children.erase(elem);
    this.tryUpdate();
    return this;
}

BaseGrid.prototype.pushCol = function(rows) {
    let l = this.startN();
    let r = (rows === undefined) ? this.endN() : l + rows - 1;
    console.log("pushCol l=", l, "r=", r, "n=", this.n());
    for (let i = l; i <= r; i++) {
        this.insert(i, this.endM(i) + 1, null);
    }
    if (l > r) { this._.m++; }
    return this;
}

/**
 * 将网格新建一行，新行拥有的列数与网格中最大列数相同
 * @returns {this} 当前节点
 */
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

/**
 * 获取网格中(i,j)处的元素
 * @param {number} i 行索引
 * @param {number} j 列索引
 * @returns {SDNode} 网格中位于(i,j)处的元素
 */
BaseGrid.prototype.element = function(i, j) {
    let elems = this.member.get("elements");
    return elems[this.idxN(i)][this.idxM(j)];
}

/**
 * 获取或者查询网格中(i,j)处的元素的价值
 * @overload
 * @param {number} i 行索引
 * @param {number} j 列索引
 * @returns {SDNode} 网格中位于(i,j)处的元素的价值
 * 
 * @overload
 * @param {number} i 行索引
 * @param {number} j 列索引
 * @param {SDNode} value 新价值
 * @returns {this} 当前节点
 */
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

/**
 * 获取或者设置网格元素的颜色
 * @overload
 * @param {import("../../Utility/Color").SDColor} color 网格所有元素的颜色都被设置为color
 * @returns {this} 当前节点
 * @overload
 * @param {number} i 行索引
 * @param {number} j 列索引
 * @returns {import("../../Utility/Color").SDColor} 网格中位于(i,j)处的元素的颜色
 * @overload
 * @param {number} i 行索引
 * @param {number} j 列索引
 * @param {Color} color 颜色
 * @returns {this} 当前节点
 */
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