import { equal } from "../../Utility/Math";
import { Box } from "../Element/Box";
import { SDNode } from "../Node";
import { ArrayBase } from "./ArrayBase";

/**
 * @class Array
 * @description 普通的数组，数组的每一个元素由等宽等高的矩形组成，矩形内部可以填充不同的价值
 */
export class Array extends ArrayBase {
    /**
     * @constructor
     * @param {SDNode} node 
     */
    constructor(node) {
        super(node);
        this.g().attr("type", "Array");
        this.newLayer("elements");
        this._.elementWidth = 40;
        this._.elementHeight = 40;
        this._.x = 0;
        this._.y = 0;
        this._.width = 0;
        this._.height = 40;
    }

    /**
     * 操作数组的width属性
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width(width) {
        this.dirtyCheck();
        if (width === undefined) return this._.width;
        const length = this.length() ? this.length() : 1;
        this.elementWidth(width / length);
        return this;
    }
    
    /**
     * 操作数组的height属性
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height(height) {
        this.dirtyCheck();
        if (height === undefined) return this._.height;
        this.elementHeight(height);
        return this;
    }

    /**
     * 操作数组的elementWidth属性
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    elementWidth(width) {
        this.dirtyCheck();
        if (width === undefined) return this._.elementWidth;
        if (equal(width, this._.elementWidth)) return this;
        this._.elementWidth = width;
        this.dirty(this, "U");
        return this;
    }

    /**
     * 操作数组的elementHeight属性
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    elementHeight(height) {
        this.dirtyCheck();
        if (height === undefined) return this._.elementHeight;
        if (equal(height, this._.elementHeight)) return this;
        this._.elementHeight = height;
        this.dirty(this, "U");
        return this;
    }

    /**
     * 插入一个元素到数组的指定位置处
     * @param {number} idx 
     * @param {Node|null} value 
     * @returns {this}
     */
    insert(idx, value = null) {
        let elem = new Box(this.layer("elements"))
        if (value !== null) elem.value(value);
        this.insertByArrayBase(idx, elem);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty(this, "U");
        return this;
    }

    /**
     * 插入一个已经存在的元素，到数组的指定位置处
     * @param {number} idx 
     * @param {Node} value 
     * @returns {this}
     */
    insertFromExistValue(idx, value) {
        let elem = new Box(this.layer("elements"));
        this.insertByArrayBase(idx, elem);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
            elem.valueFromExist(value);
        };
        this.dirty(this, "U");
        return this;
    }

    /**
     * 插入一个已经存在的元素，到数组的指定位置处
     * @param {number} idx 
     * @param {Box} value 
     * @returns {this}
     */
    insertFromExistElement(idx, value) {
        console.assert(value instanceof Box);
        this.insertByArrayBase(idx, value);
        value._.enter = (elem, move) => {
            elem.startAnimate(this);
            move();
            elem.attachTo(this.layer("elements"));
        };
        this.dirty(this, "U");
        return this;
    }

    /**
     * 删除数组中的一个元素
     * @param {number} idx 
     * @returns {this}
     */
    erase(idx) {
        let elem = this.element(idx);
        this.eraseByArrayBase(idx);
        elem.startAnimate(this).opacity(0).remove();
        this.dirty(this, "U");
        return this;
    }

    update() {
        this.preUpdate();
        let x = this.x();
        const y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this._.elements;
        for (let elem of elements) {
            const move = () => {
                elem.width(elementWidth);
                elem.height(elementHeight);
                elem.x(x).y(y);
            }
            if (elem._.enter) {
                elem._.enter(elem, move);
                elem._.enter = undefined;
            } else move();
            x += elementWidth;
        }
        this._.width = elementWidth * elements.length;
        this._.height = elementHeight;
        this.postUpdate();
        return this;
    }
}
