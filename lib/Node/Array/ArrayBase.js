import { SDHelper } from "../../Utility/SDHelper";
import { Node } from "../Node";

/**
 * @class ArrayBase
 * @description 所有序列的基类
 */
export class ArrayBase extends Node {
    constructor(node) {
        super(node);

        this._.x = 0;
        this._.y = 0;
        this._.start = 0;
        this._.elements = [];
    }

    /**
     * 获取该序列的长度
     * @returns {number} 长度
     */
    length() {
        let elems = this._.elements;
        return elems.length;
    }

    /**
     * 设置/获取该序列的起始下标（通常来说起始下标会是0或1，默认情况下为0）
     * @param {number|undefined} start 如果传入了start参数，则设置该组件的起始下标为start；否则查询该组件的起始下标
     * @returns {number|Node} 起始下标或当前节点
     */
    start(start) {
        if (start === undefined)
            return this._.start;
        this._.start = start;
        return this;
    }

    /**
     * 获取该序列的终止下标
     * @returns {number} 终止下标
     */
    end() {
        return this.start() + this.length() - 1;
    }

    /**
     * 将一个逻辑下标，转化成为一个物理下标
     * @returns 物理下标
     */
    idx(i) {
        return i - this.start();
    }

    /**
     * 根据逻辑下标，获取对应的元素
     * @param {number} idx
     * @returns 逻辑下标为idx所对应的元素 
     */
    element(idx) {
        let elems = this._.elements;
        return elems[this.idx(idx)];
    }

    /**
     * 插入一个value到序列的末尾
     * @param {} value 
     * @returns 当前节点
     */
    push(value = null) {
        this.insert(this.end() + 1, value);
        return this;
    }

    /**
     * 弹出序列的末尾元素
     * @returns 当前节点
     */
    pop() {
        if (this.length() === 0)
            throw new Error("该序列已经为空");
        this.erase(this.end());
        return this;
    }

    /**
     * 将序列的大小重设为size
     * @param {number} size 
     * @returns 当前节点
     */
    resize(size) {
        let len = this.length();
        while (len < size) { this.push(); len++; }
        while (len > size) { this.pop(); len--; }
        return this;
    }

    /**
     * 将一个elem插入到序列的第idx位置上，并将elem记录为当前节点的子节点
     * @param {number} idx 
     * @param {Node} elem 
     * @returns 当前节点
     */
    insert(idx, elem) {
        this._.elements.splice(this.idx(idx), 0, elem);
        this.children.push(elem);
        return this;
    }

    /**
     * 将位置在idx上的元素从序列中移除
     * @param {number} idx 
     * @returns 当前节点
     */
    erase(idx) {
        let elem = this.element(idx);
        this._.elements.splice(this.idx(idx), 1);
        this.children.erase(elem);
        elem.opacity(0).remove();
        return this;
    }

    /**
     * 查询序列中某个元素的价值，或者设置序列中某个元素的价值
     * @returns 
     */
    value() {
        if (arguments.length === 1) return value1.apply(this, arguments);
        if (arguments.length === 2) return value2.apply(this, arguments);
        console.log(arguments);
        throw new Error("value方法遇到错误的参数");
    }

    intValue(idx) {
        return +this.value(idx).text();
    }

    /**
     * 设置序列的整体透明度，或者查询序列中某个元素的透明度，或者设置序列中某个元素的透明度
     * @returns 
     */
    opacity() {
        if (arguments.length === 1) {
            let v = arguments[0];
            if (SDHelper.isOpacity(v)) { super.opacity(v); return this; }
            else if (typeof(v) === "number") { return this.element(v).opacity(); }
            console.log(arguments);
            throw new Error("opacity方法遇到错误的参数");

        }
        if (arguments.length === 2) return opacity2.apply(this, arguments);
        throw new Error("opacity方法遇到错误的参数");
    }

    /**
     * 设置序列整体的颜色，或者查询序列中某个元素的颜色，或者设置序列中某个元素的颜色
     * @returns 
     */
    color() {
        if (arguments.length === 1) return color1.apply(this, arguments);
        if (arguments.length === 2) return color2.apply(this, arguments);
        if (arguments.length === 3) return color3.apply(this, arguments);
        console.log(arguments);
        throw new Error("color方法遇到错误的参数");
    }
}

function value1(idx) {
    return this.element(idx).value();
}
function value2(idx, value) {
    this.element(idx).value(value);
    return this;
}

function opacity2(idx, opacity) {
    if (SDHelper.isOpacity(opacity)) {
        this.element(idx).opacity(opacity);
        return this;
    }
    console.log(arguments);
    throw new Error("opacity方法遇到错误的参数");
}

function color1(v) {
    if (SDHelper.isColor(v)) {
        for (let i = 0; i < this.length(); i++)
            this._.elements[i].color(v);
        return this;
    } else if (typeof(v) === "number") {
        return this.element(v).color();
    }
    console.log(arguments);
    throw new Error("color方法遇到错误的参数");
}
function color2(idx, color) {
    if (SDHelper.isColor(color)) {
        this.element(idx).color(color);
        return this;
    }
    console.log(arguments);
    throw new Error("color方法遇到错误的参数");
}
function color3(l, r, color) {
    for (let i = l; i <= r; i++)
        this.color(i, color);
    return this;
}