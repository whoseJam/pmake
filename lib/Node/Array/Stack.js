import { Box } from "../Element/Box";

export class Stack extends Array {
    constructor(node) {
        super(node);
        this.g().attr("type", "Stack");
        this._.width = 40;
        this._.height = 0;
    }

    insert(idx, value = null) {
        let elem = new Box(this.layer("elements")).value(value);
        super.insertByArrayBase(idx, elem);
        this._.height += this.elementHeight();
        this.update();
        elem.opacity(0).startAnimate(this).opacity(1);
        return this;
    }

    erase(idx) {
        super.eraseByArrayBase(idx);
        this._.height -= this.elementHeight();
    }

    update() {
        let x = this.x();
        let y = this.y();
        let ewidth = this.elementWidth();
        let eheight = this.elementHeight();
        let elems = this._.elements;
        for (let elem of elems) {
            elem.x(x).y(y).width(ewidth).height(eheight);
            y += eheight;
        }
        this.children.update();
        return this;
    }
}