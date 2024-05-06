import { SDHelper } from "../../Utility/SDHelper";
import { Node } from "../Node";

/**
 * @class ArrayBase
 * @description 所有序列的基类
 */
export class ArrayBase extends Node {
    constructor(node) {
        super(node);
        this._.start = 0;
        this._.elements = [];
    }

    /**
     * 获取或者设置该序列的长度
     */
    length(size) {
        if (size === undefined) {
            let elems = this._.elements;
            return elems.length;
        }
        let len = this.length();
        while (len < size) { this.push(); len++; }
        while (len > size) { this.pop(); len--; }
        return this;
    }

    resize(size) {
        this.length(size);
        return this;
    }

    /**
     * 获取或设置该序列的起始下标（通常来说起始下标会是0或1，默认情况下为0）
     * 
     * - start(1) 设置起始下标为1
     * 
     * - start() 获取序列的起始下标
     */
    start(start) {
        if (start === undefined) return this._.start;
        this._.start = start;
        return this;
    }

    /**
     * 获取该序列的终止下标
     */
    end() {
        return this.start() + this.length() - 1;
    }

    /**
     * 将一个逻辑下标，转化成为一个物理下标
     */
    idx(i) {
        return i - this.start();
    }

    /**
     * 根据逻辑下标，获取对应的元素
     */
    element(idx) {
        let elems = this._.elements;
        return elems[this.idx(idx)];
    }

    /**
     * 插入一个元素到序列的末尾
     */
    push(value = null) {
        this.insert(this.end() + 1, value);
        return this;
    }
    pushFromExistValue(value) {
        this.insertFromExistValue(this.end() + 1, value);
        return this;
    }
    pushFromExistElement(value) {
        this.insertFromExistElement(this.end() + 1, value);
        return this;
    }

    /**
     * 弹出序列的末尾元素
     */
    pop() {
        console.assert(this.length() > 0);
        this.erase(this.end());
        return this;
    }

    /**
     * 将一个elem插入到序列的第idx位置上，并将elem记录为当前节点的子节点
     */
    insertByArrayBase(idx, elem) {
        let elems = this._.elements;
        elems.splice(this.idx(idx), 0, elem);
        this.children.push(elem);
        return this;
    }

    /**
     * 将位置在idx上的元素从序列中移除
     */
    eraseByArrayBase(idx) {
        let elem = this.element(idx);
        let elems = this._.elements;
        elems.splice(this.idx(idx), 1);
        this.children.erase(elem);
        return this;
    }

    intValue(idx) {
        return +this.value(idx).text();
    }

    text(idx) {
        return this.value(idx).text();
    }

    /**
     * 获取或设置序列的透明度，或者获取或设置查询序列中某个元素的透明度
     */
    opacity() {
        if (arguments.length === 0) {
            return super.opacity();
        } else if (arguments.length === 1) {
            const opacity = arguments[0];
            if (0 <= opacity && opacity <= 1) {
                super.opacity(opacity);
                return this;
            }
            const idx = arguments[0];
            return this.element(idx).opacity();
        } else if (arguments.length === 2) {
            const idx = arguments[0];
            const opacity = arguments[1];
            this.element(idx).opacity(opacity);
            return this;
        }
        console.error(arguments);
    }

    /**
     * 查询序列中某个元素的价值，或者设置序列中某个元素的价值
     */
    value() {
        if (arguments.length === 1) {
            const idx = arguments[0];
            return this.element(idx).value();
        } else if (arguments.length === 2) {
            const idx = arguments[0];
            const value = arguments[1];
            this.element(idx).value(value);
            return this;
        }
        console.error(arguments);
    }

    /**
     * 设置序列整体的颜色，或者获取或查询序列中某个元素的颜色
     * 
     * - color(red) 把序列整体设置为红色
     * 
     * - color(1, red) 把下标为1的元素设置为红色
     * 
     * - color(1) 获取下标为1的元素的颜色
     * 
     * - color(4, 8, blue) 把下标范围[4,8]的元素设置为蓝色
     */
    color() {
        if (arguments.length === 1) {
            const idx = arguments[0];
            if (typeof(idx) === "number") return this.element(idx).color();
            const color = arguments[0];
            this.element(idx).color(color);
            return this;
        } else if (arguments.length === 2) {
            const idx = arguments[0];
            const color = arguments[1];
            this.element(idx).color(color);
            return this;
        } else if (arguments.length === 3) {
            const l = arguments[0];
            const r = arguments[1];
            const color = arguments[2];
            for (let i = l; i <= r; i++)
                this.element(i).color(color);
            return this;
        }
        console.error(arguments);
    }
}