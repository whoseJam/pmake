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

    elementWidth(width) {
        if (width === undefined) return this._.elementWidth;
        this._.elementWidth = width;
        this.update();
        return this;
    }

    elementHeight(height) {
        if (height === undefined) return this._.elementHeight;
        this._.elementHeight = height;
        this.update();
        return this;
    }

    insert(idx, value = null) {
        let elem = new Box(this.layer("elements"))
        if (value !== null) elem.value(value);
        this.insertByArrayBase(idx, elem);
        this.update();
        elem.opacity(0).startAnimate(this).opacity(1);
        return this;
    }

    insertFromExistValue(idx, value) {
        console.assert(value instanceof Node);
        let elem = new Box(this.layer("elements"));
        this.insertByArrayBase(idx, elem);
        this.update();
        elem.opacity(0).startAnimate(this).opacity(1);
        elem.valueFromExist(value);
        return this;
    }

    insertFromExistElement(idx, value) {
        console.assert(value instanceof Box);
        value.attachTo(this.layer("elements"));
        value.startAnimate(this);
        this.insertByArrayBase(idx, value);
        this.update();
        return this;
    }

    erase(idx) {
        let elem = this.element(idx);
        this.eraseByArrayBase(idx);
        this.update();
        elem.opacity(0).remove();
        return this;
    }

    update() {
        let x = this.x();
        let y = this.y();
        let ewidth = this.elementWidth();
        let eheight = this.elementHeight();
        let elems = this._.elements;
        for (let elem of elems) {
            elem.width(ewidth);
            elem.height(eheight);
            elem.x(x).y(y);
            x += ewidth;
        }
        this._.width = ewidth * elems.length;
        this._.height = eheight;
        this.children.update();
        return this;
    }
}