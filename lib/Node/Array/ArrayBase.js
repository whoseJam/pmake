import { SDHelper } from "../../Utility/SDHelper";
import { Node } from "../Node";

/**
 * @class ArrayBase
 * @description 所有ArrayLike组件的基类
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
     * 获取该ArrayLike组件的长度
     * @returns {number} 长度
     */
    length() {
        let elems = this._.elements;
        return elems.length;
    }

    /**
     * 设置/获取该ArrayLike组件的起始下标（通常来说起始下标会是0或1，默认情况下为0）
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
     * 获取该ArrayLike组件的终止下标
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
     * 插入一个value到ArrayLike组件的末尾
     * @param {} value 
     * @returns 当前节点
     */
    push(value = null) {
        this.insert(this.end() + 1, value);
        return this;
    }

    pop() {
        if (this.length() === 0)
            throw new Error("该ArrayLike组件已经为空");
        this.erase(this.end());
        return this;
    }

    resize(size) {
        let len = this.length();
        while (len < size) { this.push(); len++; }
        while (len > size) { this.pop(); len--; }
        return this;
    }

    insert(idx, elem) {
        this._.elements.splice(this.idx(idx), 0, elem);
        return this;
    }

    erase(idx) {
        let elem = this.element(i);
        this._.elements.splice(this.idx(i), 1);
        this.children.erase(elem);
        return this;
    }

    value() {
        if (arguments.length === 1) return value1.apply(this, arguments);
        if (arguments.length === 2) return value2.apply(this, arguments);
        throw new Error("ArrayLike的value方法遇到错误的参数：" + arguments);
    }

    opacity() {
        if (arguments.length === 1) {
            let v = arguments[0];
            if (SDHelper.isOpacity(v)) { super.opacity(v); return this; }
            else if (typeof(v) === "number") { return this.element(v).opacity(); }
            throw new Error("ArrayLike的opacity方法遇到错误的参数：" + arguments);

        }
        if (arguments.length === 2) return opacity2.apply(this, arguments);
        throw new Error("ArrayLike的opacity方法遇到错误的参数：" + arguments);
    }

    color() {
        if (arguments.length === 1) return color1.apply(this, arguments);
        if (arguments.length === 2) return color2.apply(this, arguments);
        throw new Error("ArrayLike的color方法遇到错误的参数：" + arguments);
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
    throw new Error("ArrayLike的opacity方法遇到错误的参数：" + arguments);
}

function color1(v) {
    if (SDHelper.isColor(v)) {
        for (let i = 0; i < this.length(); i++)
            this._.elements[i].color(v);
        return this;
    } else if (typeof(v) === "number") {
        return this.element(v).color();
    }
    throw new Error("ArrayLike的color方法遇到错误的参数：", arguments);
}

function color2(idx, color) {
    if (SDHelper.isColor(color)) {
        this.element(idx).color(color);
        return this;
    }
    throw new Error("ArrayLike的color方法遇到错误的参数：", arguments);
}