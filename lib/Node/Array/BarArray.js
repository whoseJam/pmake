import { Const } from "../../Utility/Const";
import { Rect } from "../Basic/Rect";
import { Array } from "./Array";

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
    constructor(node) {
        super(node);
        this.g().attr("type", "BarArray");
        this._.x = 0;
        this._.y = 0;
        this._.width = 0;
        this._.height = 0;
    }
    

    // --------------------插入函数--------------------
    insert(idx, value) {
        value = +value;
        console.assert(typeof(value) === "number");
        let parent = this;
        let elem = new Rect(this.layer("elements"));
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
            elem.after(0).opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty(Const.DirtyChannel.width | Const.DirtyChannel.height);
        return this;
    }

    // --------------------删除函数--------------------
    erase(idx) {
        let elem = this.element(idx);
        this.eraseByArrayBase(idx);
        elem.startAnimate(this).opacity(0).remove();
        this.dirty(Const.DirtyChannel.width | Const.DirtyChannel.height);
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
            function move() {
                elem.width(elementWidth);
                elem.height(height);
                elem.x(x).my(y);
            }
            if (elem._.enter) {
                elem._.enter(elem, move);
                elem._.enter = undefined;
            } else {
                elem.startAnimate(this);
                move();
            }
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
