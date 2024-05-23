import { D3Layer } from "@/Node/D3Layer";
import { equal } from "@/Utility/Math";
import { SDNode } from "@/Node/Node";

/**
 * @class ArrayBase
 * @description 所有序列的基类
 */
export class ArrayBase extends SDNode {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this._.start = 0;
        this._.elements = [];
    }

    /**
     * 设置元素的x属性
     * @overload
     * @param {number} x 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    x(x) {
        this.dirtyCheck("q");
        if (x === undefined) return this._.x;
        if (equal(x, this._.x)) return this;
        this._.x = x;
        this.dirty(this, "R");
        return this;
    }
    
    /**
     * 设置元素的y属性
     * @overload
     * @param {number} y 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    y(y) {
        this.dirtyCheck("q");
        if (y === undefined) return this._.y;
        if (equal(y, this._.y)) return this;
        this._.y = y;
        this.dirty(this, "R");
        return this;
    }

    /**
     * 获取或者设置该序列的长度
     * @overload
     * @param {number} size
     * @returns {this}
     * @overload
     * @returns {number}
     */
    length(size) {
        if (size === undefined) {
            const elems = this._.elements;
            return elems.length;
        }
        let len = this.length();
        while (len < size) { this.push(); len++; }
        while (len > size) { this.pop(); len--; }
        return this;
    }

    /**
     * 设置序列的长度
     * @param {number} size 
     * @returns {this}
     */
    resize(size) {
        this.length(size);
        return this;
    }

    /**
     * 获取或设置该序列的起始下标（通常来说起始下标会是0或1，默认情况下为0）
     * - start(1) 设置起始下标为1
     * - start() 获取序列的起始下标
     * @overload
     * @param {number} start
     * @returns {this}
     * @overload
     * @returns {number}
     */
    start(start) {
        if (start === undefined) return this._.start;
        this._.start = start;
        return this;
    }

    /**
     * 获取该序列的终止下标
     * @returns {number}
     */
    end() {
        return this.start() + this.length() - 1;
    }

    /**
     * 将一个逻辑下标，转化成为一个物理下标
     * @param {number} idx
     * @returns {number}
     */
    idx(idx) {
        return idx - this.start();
    }

    /**
     * 根据逻辑下标，获取对应的元素
     * @param {number} idx
     * @returns {SDNode}
     */
    element(idx) {
        const elems = this._.elements;
        const index = this.idx(idx);
        if (0 <= index && index < elems.length)
            return elems[index];
        throw new Error("Index Out Of Range");
    }

    /**
     * 获取序列中的第一个元素
     * @returns {SDNode}
     */
    firstElement() {
        return this.element(this.start());
    }

    /**
     * 获取序列中的最后一个元素
     * @returns {SDNode}
     */
    lastElement() {
        return this.element(this.end());
    }

    /**
     * 插入一个元素到序列的末尾
     * @param {number|string|SDNode|null} value
     * @returns {this}
     */
    push(value = null) {
        this.insert(this.end() + 1, value);
        return this;
    }

    /**
     * 将一个数组中全部元素插入到序列的末尾
     * @param {Array<any>|string} array
     * @returns {this}
     */
    pushArray(array) {
        for (let i = 0; i < array.length; i++)
            this.push(array[i]);
        return this;
    }

    /**
     * 插入一个现存的值元素到序列的末尾
     * @param {SDNode} value 
     * @returns {this}
     */
    pushFromExistValue(value) {
        this.insertFromExistValue(this.end() + 1, value);
        return this;
    }

    /**
     * 插入一个现存的元素到序列的末尾
     * @param {SDNode} value 
     * @returns {this}
     */
    pushFromExistElement(value) {
        this.insertFromExistElement(this.end() + 1, value);
        return this;
    }

    /**
     * 弹出序列的末尾元素
     * @returns {this}
     */
    pop() {
        this.erase(this.end());
        return this;
    }

    /**
     * 将一个元素插入到序列的对应位置上
     * @param {number} idx
     * @param {SDNode} elem
     * @returns {this}
     */
    insertByArrayBase(idx, elem) {
        const elements = this._.elements;
        elements.splice(this.idx(idx), 0, elem);
        this.children.push(elem);
        return this;
    }

    /**
     * 将对应位置上的元素从序列中移除
     * @param {number} idx
     * @returns {this}
     */
    eraseByArrayBase(idx) {
        const elem = this.element(idx);
        const elems = this._.elements;
        elems.splice(this.idx(idx), 1);
        this.children.erase(elem);
        return this;
    }

    /**
     * @param {number} idx 
     * @returns {this}
     */
    erase(idx) {
        const elem = this.element(idx);
        this.eraseByArrayBase(idx);
        elem.opacity(0).remove();
        this.dirty(this, "U");
        return this;
    }

    /**
     * @param {number} idx 
     * @returns {SDNode}
     */
    dropElement(idx) {
        const elem = this.element(idx);
        this.eraseByArrayBase(idx);
        this.dirty(this, "U");
        return elem;
    }

    /**
     * @param {number} idx 
     * @returns {SDNode}
     */
    dropValue(idx) {
        const elem = this.element(idx);
        this.eraseByArrayBase(idx);
        const value = elem.after(this.delay()).drop();
        elem.startAnimate(this).opacity(0).remove();
        this.dirty(this, "U");
        return value;
    }

    /**
     * 获取序列中对应元素的字符文本
     * @param {number} idx 
     * @returns {string}
     */
    text(idx) {
        return this.value(idx).text();
    }

    /**
     * 获取序列中对应元素的数值
     * @param {number} idx 
     * @returns {number}
     */
    intValue(idx) {
        return +this.value(idx).text();
    }

    /**
     * 操作序列的透明度，或者操作序列中某个元素的透明度
     * @overload
     * @returns {number}
     * @overload
     * @param {number} opacity
     * @returns {this}
     * @overload
     * @param {number} idx
     * @returns {number}
     * @overload
     * @param {number} idx
     * @param {number} opacity
     * @returns {this}
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
        throw new Error("Invalid Arguments");
    }

    /**
     * 查询序列中某个元素的价值，或者设置序列中某个元素的价值
     * @overload
     * @param {number} idx
     * @returns {any}
     * @overload
     * @param {number} idx
     * @param {SDNode} value
     * @returns {this}
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
        throw new Error("Invalid Arguments");
    }

    /**
     * 设置序列整体的颜色，或者获取或查询序列中某个元素的颜色
     * - color(red) 把序列整体设置为红色
     * - color(1, red) 把下标为1的元素设置为红色
     * - color(1) 获取下标为1的元素的颜色
     * - color(4, 8, blue) 把下标范围[4,8]的元素设置为蓝色
     * @overload
     * @param {string|{main: string, border: string}} color
     * @returns {this}
     * @overload
     * @param {number} idx
     * @returns {string|{main: string, border: string}}
     * @overload
     * @param {number} idx
     * @param {string|{main: string, border: string}} color
     * @returns {this}
     * @overload
     * @param {number} l
     * @param {number} r
     * @param {string|{main: string, border: string}} color
     * @returns {this}
     */
    color() {
        if (arguments.length === 1) {
            const idx = arguments[0];
            if (typeof(idx) === "number") return this.element(idx).color();
            const color = arguments[0];
            for (let i = this.start(); i <= this.end(); i++)
                this.element(i).color(color);
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
        throw new Error("Invalid Arguments");
    }
}