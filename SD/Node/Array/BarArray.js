import { Array } from "@/Node/Array/Array";
import { D3Layer } from "@/Node/D3Layer";
import { Rect } from "@/Node/Basic/Rect";
import { SDNode } from "@/Node/Node";

/**
 * @class BarArray
 * @description 
 * 
 * 用柱状图的形式去展示一个数组
 * 
 * 数组中的每个元素的本质必须是一个数字（可以不为整数），表现为一个Rect，所有Rect具有相同的宽度，一个
 * Rect的高度随元素价值的不同而不同，计算公式如下：
 * 
 * height(Rect) = value * elementHeight(BarArray)
 * 
 * 当一个Rect在BarArray被创建时，会往Rect中添加配套的value方法，调用value方法会修改Rect的高度和内部
 * 保存的元素价值
 */
export class BarArray extends Array {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node
     */
    constructor(node) {
        super(node);
        this.g().type("BarArray");
        this._.x = 0;
        this._.y = 0;
        this._.width = 0;
        this._.height = 0;
    }
    
    /**
     * 插入一个元素到数组的指定位置处
     * @param {number} idx 
     * @param {number|string} value 
     * @returns {this}
     */
    insert(idx, value) {
        value = +value;
        if (typeof(value) !== "number") throw new Error("Invalid Arguments");
        const parent = this;
        const elem = new Rect(this.layer("elements"));
        elem._.value = value;
        elem.value = function(value) {
            if (value === undefined) return this._.value;
            this._.value = value;
            let baseline = this.my();
            this.height(value * parent.elementHeight());
            this.my(baseline);
            return this;
        }
        this.insertByArrayBase(idx, elem);
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this);
            elem.opacity(1);
        };
        this.dirty(this, "U");
        return this;
    }

    insertFromExistValue() {
        throw new Error("Not Implemented Yet");
    }

    insertFromExistElement() {
        throw new Error("Not Implemented Yet");
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
        const y = this.my();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this._.elements;
        let maxHeight = 0;
        for (let elem of elements) {
            const height = elem.value() * elementHeight;
            const move = () => {
                elem.width(elementWidth);
                elem.height(height);
                elem.x(x).my(y);
            }
            if (elem._.enter) {
                elem._.enter(elem, move);
                elem._.enter = undefined;
            } else move();
            maxHeight = Math.max(maxHeight, height);
            x += elementWidth;
        }
        this._.width = elementWidth * elements.length;
        this._.height = maxHeight;
        this._.y = y - maxHeight;
        this.postUpdate();
        return this;
    }
}
