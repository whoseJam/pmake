import { Const } from "../../Utility/Const";
import { Box } from "../Element/Box";
import { Array } from "./Array";

export class Stack extends Array {
    constructor(node) {
        super(node);
        this.g().attr("type", "Stack");
        this._.x = 0;
        this._.y = 0;
        this._.width = 40;
        this._.height = 0;
    }

    // --------------------大小调整--------------------
    width(width) {
        this.dirtyCheck(Const.DirtyChannel.width);
        if (width === undefined) return this._.width;
        this.elementWidth(width);
        return this;
    }
    height(height) {
        this.dirtyCheck(Const.DirtyChannel.height);
        if (height === undefined) return this._.height;
        const length = this.length() ? this.length() : 1;
        this.elementHeight(height / length);
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
        this.dirty(this, "U");
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
        this.dirty(this, "U");
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
        this.dirty(this, "U");
        return this;
    }

    // --------------------删除函数--------------------
    erase(idx) {
        let elem = this.element(idx);
        this.eraseByArrayBase(idx);
        elem.startAnimate(this).opacity(0).remove();
        this.dirty(this, "U");
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
        this.postUpdate();
        return this;
    }
}

