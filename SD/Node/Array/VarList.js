import { ArrayBase } from "@/Node/Array/ArrayBase";
import { Context } from "@/Animate/Context";
import { D3Layer } from "@/Node/D3Layer";
import { SDNode } from "@/Node/Node";
import { Text } from "@/Node/Basic/Text";

/**
 * @class VarList
 * @description 提供了对变量的管理，可以定义变量，修改变量的值
 */
export class VarList extends ArrayBase {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this.g().type("VarList");
        this._.x = 0;
        this._.y = 0;
        this._.width = 0;
        this._.height = 0;
        this._.fontSize = 25;
        this._.dx = 40;
    }

    /**
     * @overload
     * @param {number} fontSize 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    fontSize(fontSize) {
        this.dirtyCheck("q");
        if (fontSize === undefined) return this._.fontSize;
        this._.fontSize = fontSize;
        this.dirty(this, "U");
        return this;
    }

    /**
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width(width) {
        this.dirtyCheck("q");
        if (width === undefined) return this._.width;
        const owidth = this._.width;
        const k = owidth > 0 ? width / owidth : 1;
        this.fontSize(this.fontSize() * k);
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
        if (height === undefined)
            return this._.height;
        const oheight = this._.height;
        const k = oheight > 0 ? height / oheight : 1;
        this.fontSize(this.fontSize() * k);
        return this;
    }

    /**
     * @param {number|string} key 
     * @param {number|string} value 
     * @returns {this}
     */
    put(key, value) {
        const stringValue = value === Infinity ? "inf" : value;
        const elements = this._.elements;
        for (let element of elements) {
            if (element.key == key) {
                const context = new Context(this);
                element.startAnimate(context.tillc(0, 0.5));
                element.opacity(0).dx(this._.dx);
                element.value = value;
                element.text(`${key}=${stringValue}`);
                element.startAnimate(context.tillc(0.5, 1));
                element.opacity(1).dx(-this._.dx);
                element.startAnimate(this);
                return this;
            }
        }
        const element = new Text(this, `${key}=${stringValue}`);
        element.key = key;
        element.value = value;
        element._.enter = (element, move) => {
            element.opacity(0);
            move();
            element.startAnimate(this);
            element.opacity(1);
        }
        this.dirty(this, "U");
        this.insertByArrayBase(this.end() + 1, element);
        return this;
    }

    /**
     * @param {number|string} key 
     * @returns {number|string|undefined}
     */
    get(key) {
        const elements = this._.elements;
        for (let element of elements)
            if (element.key == key) return element.value;
        return undefined;
    }

    /**
     * @param {number|string} key
     * @returns {SDNode} 
     */
    element(key) {
        const elements = this._.elements;
        for (let element of elements)
            if (element.key == key) return element;
        throw new Error("Value Not Found In VarList");
    }

    /**
     * @param {number|string} key 
     * @returns {this}
     */
    inc(key) {
        this.put(key, this.get(key) + 1);
        return this;
    }

    /**
     * @param {number|string} key 
     * @returns {this}
     */
    dec(key) {
        this.put(key, this.get(key) - 1);
        return this;
    }

    /**
     * @param {number|string} key 
     * @param {number} delta 
     * @returns {this}
     */
    incBy(key, delta) {
        this.put(key, this.get(key) + delta);
        return this;
    }

    update() {
        this.preUpdate();
        const x = this._.x;
        let y = this._.y;
        let width = 0;
        let height = 0;
        const elements = this._.elements;
        for (let element of elements) {
            const move = () => {
                element.fontSize(this._.fontSize);
                element.x(x).y(y);
            }
            if (element._.enter) {
                element._.enter(element, move);
                element._.enter = undefined;
            } else move();
            width = Math.max(width, element.width());
            height += element.height();
            y += element.height();
        }
        this._.width = width;
        this._.height = height;
        this.postUpdate();
        return this;
    }
}