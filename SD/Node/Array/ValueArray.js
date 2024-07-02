import { Array } from "@/Node/Array/Array";
import { D3Layer } from "@/Node/D3Layer";
import { SDNode } from "@/Node/Node";

/**
 * @class ValueArray
 */
export class ValueArray extends Array {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this.g().type("ValueArray");
        this._.x = 0;
        this._.y = 0;
        this._.width = 0;
        this._.height = 40;
    }

    /**
     * @param {number} idx 
     * @param {SDNode} value 
     * @returns {this}
     */
    insert(idx, value) {
        const elem = value;
        elem._.enter = (elem, move) => {
            elem.attachTo(this.layer("elements"));
            elem.opacity(0);
            move();
            elem.startAnimate(this);
            elem.opacity(1);
        };
        this.insertByArrayBase(idx, elem);
        this.tryUpdate();
        return this;
    }

    /**
     * @param {number} idx 
     * @param {SDNode} value 
     * @returns {this}
     */
    insertFromExistValue(idx, value) {
        const elem = value;
        elem._.enter = (elem, move) => {
            elem.attachTo(this.layer("elements"));
            elem.startAnimate(this);
            move();
            elem.opacity(1);
        };
        this.insertByArrayBase(idx, elem);
        this.tryUpdate();
        return this;
    }

    /**
     * @param {number} idx 
     * @param {SDNode} value 
     * @returns {this}
     */
    insertFromExistElement(idx, value) {
        return this.insertFromExistValue(idx, value);
    }

    update() {
        this.preUpdate();
        let x = this.x();
        const y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this._.elements;
        for (let element of elements) {
            function move() {
                element.cx(x + elementWidth / 2)
                element.cy(y + elementHeight / 2);
            }
            if (element._.enter) {
                element._.enter(element, move);
                element._.enter = undefined;
            } else move();
            x += elementWidth;
        }
        this._.width = elementWidth * elements.length;
        this._.height = elementHeight;
        this.postUpdate();
        return this;
    }
}