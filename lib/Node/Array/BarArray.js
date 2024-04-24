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

    elementHeight(height) {
        if (height === undefined) return this._.elementHeight;
        this._.elementHeight = height;
        return this;
    }

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
            this.height(rectHeight(value, parent.elementHeight()));
            this.my(baseline);
            return this;
        }
        this.insertByArrayBase(idx, elem);
        elem.events.enter = function(elem, move) {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        elem.events.enterFlag = true;
        updateSize(this);
        return this;
    }

    erase(idx) {
        let elem = this.element(idx);
        this.eraseByArrayBase(idx);
        elem.opacity(0).remove();
        updateSize(this);
        return this;
    }

    update() {
        let x = this.x(), y = this.my();
        let ewidth = this.elementWidth();
        let eheight = this.elementHeight();
        let elems = this._.elements;
        let maxHeight = 0;
        for (let elem of elems) {
            let height = rectHeight(elem.value(), eheight);
            function move() {
                elem.width(ewidth);
                elem.height(height);
                elem.x(x).my(y);
            }
            if (elem.events.enterFlag) {
                elem.events.enter(elem, move);
                elem.events.enterFlag =  false;
            } else move();
            maxHeight = Math.max(maxHeight, height);
            x += ewidth;
        }
        this._.width = ewidth * elems.length;
        this._.height = maxHeight;
        this._.y = y - maxHeight;
        this.children.update();
        return this;
    }
}

function updateSize(self) {
    let y = self.my();
    let ewidth = self.elementWidth();
    let eheight = self.elementHeight();
    let elems = self._.elements;
    let maxHeight = 0;
    for (let elem of elems) {
        let height = rectHeight(elem.value(), eheight);
        maxHeight = Math.max(maxHeight, height);
    }
    self._.width = ewidth * elems.length;
    self._.height = maxHeight;
    self._.y = y - maxHeight;
}

function rectHeight(value, height) {
    return value * height;
}