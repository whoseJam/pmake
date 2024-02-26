import { Node } from "../Node";

export class GridBase extends Node {
    constructor(node) {
        super(node);
        this._.n = 0;
        this._.m = 0;
        this._.x = 0;
        this._.y = 0;
        this._.startN = 0;
        this._.startM = 0;
        this._.elements = [];
        return this;
    }
    
    /**
     * 设置或者网格组件在N方向上的起始索引
     * @overload 设置网格组件在N方向上的起始索引
     * @param {number} start 网格组件在N方向的新起始索引
     * @returns {Node} 当前节点
     * 
     * @overload 查询网格组件在N方向上的起始索引
     * @returns {number} 起始索引
     */
    startN(start) {
        if (start === undefined)
            return this._.startN;
        this._.startN = start;
        return this;
    }

    /**
     * 设置或者网格组件在M方向上的起始索引
     * @overload 设置网格组件在M方向上的起始索引
     * @param {number} start 网格组件在M方向的新起始索引
     * @returns {Node} 当前节点
     * 
     * @overload 查询网格组件在N方向上的起始索引
     * @returns {number} 起始索引
     */
    startM(start) {
        if (start === undefined)
            return this._.startM;
        this._.startM = start;
        return this;
    }

    /**
     * 查询网格组件在N方向的终止索引
     * @returns 网格组件在N方向的终止索引
     */
    endN() {
        return this.startN() + this.n() - 1;
    }

    /**
     * 查询网格组件在M方向上的终止索引
     * @overload
     * @param {number} idx 查询第idx行
     * @returns {number} 网格在第idx行上的终止索引
     * 
     * @overload
     * @returns {number} 网格所有行中的最大终止索引
     */
    endM(idx) {
        if (idx === undefined)
            return this.startM() + this.m() - 1;
        let elems = this._.elements;
        return this.startM() + elems[this.idxN(idx)].length - 1;
    }

    /**
     * 将一个逻辑行索引，转化成物理行索引
     * @param {number} idx 逻辑行索引
     * @returns {number} 对应的物理行索引
     */
    idxN(idx) {
        return idx - this.startN();
    }

    /**
     * 将一个逻辑列索引，转化成物理列索引
     * @param {number} idx 逻辑列索引
     * @returns {number} 对应的物理列索引
     */
    idxM(idx) {
        return idx - this.startM();
    }

    /**
     * 将网格组件的行数，对齐到给定行数
     * @param {number} n 对齐行数
     * @returns {Node} 当前节点
     */
    n(n) {
        let on = this._.n;
        if (n === undefined) return on;
        while (on < n) { this.pushRow(); on++; }
        while (on > n) { this.popRow(); on--; }
        return this;
    }

    /**
     * 将网格组件的列数，对齐到给定列数
     * @param {number} m 对齐列数
     * @returns {Node} 当前节点
     */
    m(m) {
        let om = this._.m;
        if (m === undefined) return om;
        while (om < m) { this.pushCol(); om++; }
        while (om > m) { this.popCol(); om--; }
        return this;
    }

    getM(idx) {
        return this.endM() - this.startM() + 1;
    }

    /**
     * 将一个elem插入到网格第i,j位置上，并将elem记录为当前节点的子节点
     * @param {number} i 
     * @param {number} j 
     * @param {Node} elem 
     * @returns 当前节点
     */
    insert(i, j, elem) {
        let ri = this.idxN(i);
        let rj = this.idxM(j);
        let elems = this._.elements;
        while (elems.length <= ri) elems.push([]);
        elems[ri].splice(rj, 0, elem);
        this.children.push(elem);
        this._.n = Math.max(ri + 1, this._.n);
        this._.m = Math.max(rj + 1, this._.m);
        return this;
    }

    /**
     * 将网格的每一行新建一列
     * @returns {Node} 当前节点
     */
    pushCol() {
        for (let i = this.startN(); i <= this.endN(); i++)
            this.insert(i, this.endM(i) + 1, null);
        return this;
    }

    /**
     * 将网格新建一行，新行拥有的列数与网格中最大列数相同
     * @returns {Node} 当前节点
     */
    pushRow() {
        let n = this.endN() + 1;
        for (let j = this.startM(); j <= this.endM(); j++)
            this.insert(n, j, null)
        return this;
    }

    /**
     * 获取网格中(i,j)处的元素
     * @param {number} i 行索引
     * @param {number} j 列索引
     * @returns {Node} 网格中位于(i,j)处的元素
     */
    element(i, j) {
        let elems = this._.elements;
        return elems[this.idxN(i)][this.idxM(j)];
    }

    /**
     * 获取或者查询网格中(i,j)处的元素的价值
     * @overload
     * @param {number} i 行索引
     * @param {number} j 列索引
     * @returns {Node} 网格中位于(i,j)处的元素的价值
     * 
     * @overload
     * @param {number} i 行索引
     * @param {number} j 列索引
     * @param {Node} value 新价值
     * @returns {Node} 当前节点
     */
    value() {
        if (arguments.length === 2) return value2.apply(this, arguments);
        if (arguments.length === 3) return value3.apply(this, arguments);
        console.log(arguments);
        throw new Error("无效的参数")
    }

    /**
     * 获取或者设置网格元素的透明度
     * @overload
     * @param {number} opacity 网格所有元素的透明度都被设置为opacity
     * @returns {Node} 当前节点
     * 
     * @overload
     * @param {number} i 行索引
     * @param {number} j 列索引
     * @returns {number} 网格中位于(i,j)处的元素的透明度
     * 
     * @overload
     * @param {number} i 行索引
     * @param {number} j 列索引
     * @param {number} opacity 透明度
     * @returns {Node} 当前节点
     */
    opacity() {
        if (arguments.length === 1) {
            super.opacity(arguments[0]);
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
     * @param {Color} color 网格所有元素的颜色都被设置为color
     * @returns {Node} 当前节点
     * 
     * @overload
     * @param {number} i 行索引
     * @param {number} j 列索引
     * @returns {Color} 网格中位于(i,j)处的元素的颜色
     * 
     * @overload
     * @param {number} i 行索引
     * @param {number} j 列索引
     * @param {Color} color 颜色
     * @returns {Node} 当前节点
     */
    color() {
        if (arguments.length === 1) return color1.apply(this, arguments);
        if (arguments.length === 2) return color2.apply(this, arguments);
        if (arguments.length === 3) return color3.apply(this, arguments);
        console.log(arguments);
        throw new Error("无效的参数");
    }

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
    let elems = this._.elements;
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