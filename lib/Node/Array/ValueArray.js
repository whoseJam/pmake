import { Array } from "./Array";

export class ValueArray extends Array {
    constructor(node) {
        super(node);
        this.g().attr("type", "ValueArray");
    }

    insert(idx, value = null) {
        this.insertByArrayBase(idx, value);
        this._.width += this.elementWidth();
        return this;
    }

    erase(idx) {
        this.eraseByArrayBase(idx);
        this._.width -= this.elementWidth();
    }

    update() {
        let x = this.x();
        let y = this.y();
        let ewidth = this.elementWidth();
        let eheight = this.elementHeight();
        let elems = this._.elements;
        for (let elem of elems) {
            elem.cx(x + ewidth / 2).cy(y + eheight / 2);
            x += ewidth;
        }
        this.children.update();
        return this;
    }
}