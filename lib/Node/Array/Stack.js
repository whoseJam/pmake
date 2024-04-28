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
        this.dirtyCheck();
        if (width === undefined) return this._.width;
        this.elementWidth(width);
        return this;
    }
    height(height) {
        this.dirtyCheck();
        if (height === undefined) return this._.height;
        const length = this.length() ? this.length() : 1;
        this.elementHeight(height / length);
        return this;
    }

    update() {
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
            } else {
                elem.startAnimate(this);
                move();
            }
            y += elementHeight;
        }
        this._.width = elementWidth;
        this._.height = elementHeight * elements.length;
        this.children.update();
        return this;
    }
}

