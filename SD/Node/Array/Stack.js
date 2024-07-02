import { Array } from "@/Node/Array/Array";
import { D3Layer } from "@/Node/D3Layer";
import { equal } from "@/Utility/Math";
import { SDNode } from "@/Node/SDNode";

/**
 * @class Stack
 * @description 普通的栈，向下增长
 */
export class Stack extends Array {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this.g().type("Stack");
        this._.x = 0;
        this._.y = 0;
        this._.width = 40;
        this._.height = 0;
    }

    /**
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width(width) {
        if (width === undefined) return this._.width;
        this.elementWidth(width);
        return this;
    }

    /**
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height(height) {
        if (height === undefined) return this._.height;
        const length = this.length() ? this.length() : 1;
        this.elementHeight(height / length);
        return this;
    }

    /**
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    elementWidth(width) {
        if (width === undefined) return this._.elementWidth;
        if (equal(width, this._.elementWidth)) return this;
        this._.elementWidth = width;
        this._.width = width;
        this.tryUpdate();
        return this;
    }

    /**
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    elementHeight(height) {
        if (height === undefined) return this._.elementHeight;
        if (equal(height, this._.elementHeight)) return this;
        this._.elementHeight = height;
        this._.height = height * this._.elements.length;
        this.tryUpdate();
        return this;
    }

    update() {
        this.preUpdate();
        const x = this.x();
        let y = this.y();
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
            y += elementHeight;
        }
        this._.width = elementWidth;
        this._.height = elementHeight * elements.length;
        super.update();
        this.postUpdate();
        return this;
    }
}

