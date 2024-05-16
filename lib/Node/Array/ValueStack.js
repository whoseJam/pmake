import { D3Layer } from "../D3Layer";
import { SDNode } from "../Node";
import { Stack } from "./Stack";
import { ValueArray } from "./ValueArray";

/**
 * @class ValueStack
 */
export class ValueStack extends Stack {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node);
        this.g().type("ValueStack");
        this._.x = 0;
        this._.y = 0;
        this._.width = 40;
        this._.height = 0;
    }

    /**
     * @param {number} idx 
     * @param {SDNode} value 
     * @returns {this}
     */
    insert(idx, value) {
        const insert = ValueArray.prototype.insert;
        insert.call(this, idx, value);
        return this;
    }

    /**
     * @param {number} idx 
     * @param {SDNode} value 
     * @returns {this}
     */
    insertFromExistValue(idx, value) {
        const insertFromExistValue = ValueArray.prototype.insertFromExistValue;
        insertFromExistValue.call(this, idx, value);
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
        const x = this.x();
        let y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this._.elements;
        for (let element of elements) {
            function move() {
                element.cx(x + ewidth / 2);
                element.cy(y + eheight / 2);
            }
            if (element._.enter) {
                element._.enter(elem, move);
                element._.enter = undefined;
            } else move();
            y += elementHeight;
        }
        this._.width = elementWidth;
        this._.height = elementHeight * elements.length;
        this.postUpdate();
        return this;
    }
}