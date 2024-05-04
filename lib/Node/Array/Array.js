import { Const } from "../../Utility/Const";
import { equal } from "../../Utility/Math";
import { Box } from "../Element/Box";
import { Node } from "../Node";
import { ArrayBase } from "./ArrayBase";

/**
 * @class Array
 * @description 普通的数组，数组的每一个元素由等宽等高的矩形组成，矩形内部可以填充不同的价值
 */
export class Array extends ArrayBase {
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

    // --------------------大小调整--------------------
    width(width) {
        this.dirtyCheck(Const.DirtyChannel.width);
        if (width === undefined) return this._.width;
        const length = this.length() ? this.length() : 1;
        this.elementWidth(width / length);
        return this;
    }
    height(height) {
        this.dirtyCheck(Const.DirtyChannel.height);
        if (height === undefined) return this._.height;
        this.elementHeight(height);
        return this;
    }
    elementWidth(width) {
        this.dirtyCheck(Const.DirtyChannel.width);
        if (width === undefined) return this._.elementWidth;
        if (equal(width, this._.elementWidth)) return this;
        this._.elementWidth = width;
        this.dirty(Const.DirtyChannel.width);
        return this;
    }
    elementHeight(height) {
        this.dirtyCheck(Const.DirtyChannel.height);
        if (height === undefined) return this._.elementHeight;
        if (equal(height, this._.elementHeight)) return this;
        this._.elementHeight = height;
        this.dirty(Const.DirtyChannel.height);
        return this;
    }

    // --------------------插入函数--------------------
    insert(idx, value = null) {
        let elem = new Box(this.layer("elements"))
        if (value !== null) elem.value(value);
        this.insertByArrayBase(idx, elem);
        elem._.enter = (elem, move) => {
            elem.after(0).opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty(Const.DirtyChannel.width);
        return this;
    }
    insertFromExistValue(idx, value) {
        let elem = new Box(this.layer("elements"));
        this.insertByArrayBase(idx, elem);
        elem._.enter = (elem, move) => {
            elem.startAnimate(this);
            move();
        };
        elem.valueFromExist(value);
        this.dirty(Const.DirtyChannel.width);
        return this;
    }
    insertFromExistElement(idx, value) {
        console.assert(value instanceof Box);
        value.attachTo(this.layer("elements"));
        this.insertByArrayBase(idx, value);
        value._.enter = (elem, move) => {
            elem.startAnimate(this);
            move();
        };
        this.dirty(Const.DirtyChannel.width);
        return this;
    }

    // --------------------删除函数--------------------
    erase(idx) {
        let elem = this.element(idx);
        this.eraseByArrayBase(idx);
        elem.startAnimate(this).opacity(0).remove();
        this.dirty(Const.DirtyChannel.width);
        return this;
    }

    update() {
        this.preUpdate();
        this._.isDirty = undefined;
        this._.dirtyByMe = 0;
        let x = this.x();
        const y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this._.elements;
        for (let elem of elements) {
            function move() {
                elem.width(elementWidth);
                elem.height(elementHeight);
                elem.x(x).y(y);
            }
            if (elem._.enter) {
                elem._.enter(elem, move);
                elem._.enter = undefined;
            } else {
                elem.startAnimate(this);
                move();
            }
            x += elementWidth;
        }
        this._.width = elementWidth * elements.length;
        this._.height = elementHeight;
        this.children.update();
        this.postUpdate();
        return this;
    }
}
