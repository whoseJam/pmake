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

    update() {
        let x = this.x();
        let y = this.y();
        let ewidth = this.elementWidth();
        let eheight = this.elementHeight();
        let elems = this._.elements;
        for (let elem of elems) {
            const move = () => {
                elem.width(ewidth);
                elem.height(eheight);
                elem.x(x).y(y);
            }
            if (elem.events.enterFlag) {
                elem.events.enter(elem, move);
                elem.events.enterFlag = false;
            } else move();
            y += eheight;
        }
        this._.height = eheight * elems.length;
        this._.width = ewidth;
        this.children.update();
        return this;
    }
}