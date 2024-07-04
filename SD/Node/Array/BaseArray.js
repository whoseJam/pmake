import { D3Layer } from "@/Node/D3Layer";
import { equal } from "@/Utility/Math";
import { SDNode } from "@/Node/SDNode";
import { naiveGetterAndSetter } from "../Common";

export function BaseArray(parent) {
    SDNode.call(this, parent);

    this.member.new("start", 0);
    this.member.new("elements", []);
}

BaseArray.prototype = {
    ...SDNode.prototype
};

BaseArray.prototype.x     = naiveGetterAndSetter("x", "setByEqual");
BaseArray.prototype.y     = naiveGetterAndSetter("y", "setByEqual");
BaseArray.prototype.start = naiveGetterAndSetter("start", "set");
BaseArray.prototype.updateList = [...BaseArray.prototype.updateList];

/**
 * 获取或者设置该序列的长度
 * @overload
 * @param {number} size
 * @returns {this}
 * @overload
 * @returns {number}
 */
BaseArray.prototype.length = function(size) {
    if (size === undefined) {
        const elements = this.member.get("elements");
        return elements.length;
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
BaseArray.prototype.resize = function(size) {
    this.length(size);
    return this;
}


/**
 * 获取该序列的终止下标
 * @returns {number}
 */
BaseArray.prototype.end = function() {
    return this.start() + this.length() - 1;
}

/**
 * 将一个逻辑下标，转化成为一个物理下标
 * @param {number} idx
 * @returns {number}
 */
BaseArray.prototype.idx = function(idx) {
    return idx - this.start();
}

/**
 * 根据逻辑下标，获取对应的元素
 * @param {number} idx
 * @returns {SDNode}
 */
BaseArray.prototype.element = function(idx) {
    const elements = this.member.get("elements");
    const index = this.idx(idx);
    if (0 <= index && index < elements.length)
        return elements[index];
    throw new Error("Index Out Of Range");
}

/**
 * 获取序列中的第一个元素
 * @returns {SDNode}
 */
BaseArray.prototype.firstElement = function() {
    return this.element(this.start());
}

/**
 * 获取序列中的最后一个元素
 * @returns {SDNode}
 */
BaseArray.prototype.lastElement = function() {
    return this.element(this.end());
}

/**
 * 插入一个元素到序列的末尾
 * @param {number|string|SDNode|null} value
 * @returns {this}
 */
BaseArray.prototype.push = function(value = null) {
    this.insert(this.end() + 1, value);
    return this;
}

/**
 * 将一个数组中全部元素插入到序列的末尾
 * @param {Array<any>|string} array
 * @returns {this}
 */
BaseArray.prototype.pushArray = function(array) {
    for (let i = 0; i < array.length; i++)
        this.push(array[i]);
    return this;
}

/**
 * 插入一个现存的值元素到序列的末尾
 * @param {SDNode} value 
 * @returns {this}
 */
BaseArray.prototype.pushFromExistValue = function(value) {
    this.insertFromExistValue(this.end() + 1, value);
    return this;
}

/**
 * 插入一个现存的元素到序列的末尾
 * @param {SDNode} value 
 * @returns {this}
 */
BaseArray.prototype.pushFromExistElement = function(value) {
    this.insertFromExistElement(this.end() + 1, value);
    return this;
}

/**
 * 弹出序列的末尾元素
 * @returns {this}
 */
BaseArray.prototype.pop = function() {
    this.erase(this.end());
    return this;
}

/**
 * 将一个元素插入到序列的对应位置上
 * @param {number} idx
 * @param {SDNode} elem
 * @returns {this}
 */
BaseArray.prototype.insertByBaseArray = function(idx, elem) {
    const elements = this.member.get("elements");
    elements.splice(this.idx(idx), 0, elem);
    this.children.push(elem);
    this.member.dirty("elements");
    return this;
}

/**
 * 将对应位置上的元素从序列中移除
 * @param {number} idx
 * @returns {this}
 */
BaseArray.prototype.eraseByBaseArray = function(idx) {
    const elem = this.element(idx);
    const elems = this.member.get("elements");
    elems.splice(this.idx(idx), 1);
    this.children.erase(elem);
    this.member.dirty("elements");
    this.tryUpdate();
    return this;
}

/**
 * @param {number} idx 
 * @returns {this}
 */
BaseArray.prototype.erase = function(idx) {
    const elem = this.element(idx);
    this.eraseByBaseArray(idx);
    elem.opacity(0).remove();
    return this;
}

/**
 * @param {number} idx 
 * @returns {SDNode}
 */
BaseArray.prototype.dropElement = function(idx) {
    const elem = this.element(idx);
    this.eraseByBaseArray(idx);
    return elem;
}

/**
 * @param {number} idx 
 * @returns {SDNode}
 */
BaseArray.prototype.dropValue = function(idx) {
    const elem = this.element(idx);
    this.eraseByBaseArray(idx);
    const value = elem.after(this.delay()).drop();
    elem.startAnimate(this).opacity(0).remove();
    return value;
}

/**
 * 获取序列中对应元素的字符文本
 * @param {number} idx 
 * @returns {string}
 */
BaseArray.prototype.text = function(idx) {
    return this.value(idx).text();
}

/**
 * 获取序列中对应元素的数值
 * @param {number} idx 
 * @returns {number}
 */
BaseArray.prototype.intValue = function(idx) {
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
BaseArray.prototype.opacity = function() {
    if (arguments.length === 0) {
        return SDNode.opacity.call(this);
    } else if (arguments.length === 1) {
        const opacity = arguments[0];
        if (0 <= opacity && opacity <= 1) {
            SDNode.opacity.call(this, opacity);
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
BaseArray.prototype.value = function() {
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
BaseArray.prototype.color = function() {
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