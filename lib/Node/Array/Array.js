import { Box } from "../Element/Box";
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
        this._.width = 0;
        this._.height = 40;
    }

    elementWidth(width) {
        if (width === undefined)
            return this._.elementWidth;
        this._.elementWidth = width;
        this._.width = width * this.length();
        return this;
    }

    elementHeight(height) {
        if (height === undefined)
            return this._.elementHeight;
        this._.elementHeight = height;
        this._.height = height;
        return this;
    }

    insert(idx, value = null) {
        let elem = new Box(this.layer("elements")).value(value);
        super.insert(idx, elem);
        this._.width += this.elementWidth();
        this.update();
        elem.opacity(0).startAnimate(this).opacity(1);
        return this;
    }

    erase(idx) {
        super.erase(idx);
        this._.width -= this.elementWidth();
    }

    update() {
        let x = this.x();
        let y = this.y();
        let ewidth = this.elementWidth();
        let eheight = this.elementHeight();
        let elems = this._.elements;
        for (let elem of elems) {
            elem.parent = null;
            elem.x(x).y(y).width(ewidth).height(eheight);
            elem.parent = this;
            x += ewidth;
        }
        super.update();
        return this;
    }
}