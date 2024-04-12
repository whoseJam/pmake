import { Array } from "./Array";

export class ValueArray extends Array {
    constructor(node) {
        super(node);
        this.g().attr("type", "ValueArray");
        this._.x = 0;
        this._.y = 0;
        this._.width = 0;
        this._.height = 40;
    }

    insert(idx, value) {
        value.attachTo(this.layer("elements"));
        this.insertByArrayBase(idx, value);
        this.update();
        value.opacity(0).startAnimate(this).opacity(1);
        return this;
    }

    insertFromExist(idx, value) {
        value.attachTo(this.layer("elements"));
        this.insertByArrayBase(idx, value);
        value.startAnimate(this);
        this.update();
        return this;
    }

    update() {
        let x = this.x();
        let y = this.y();
        let ewidth = this.elementWidth();
        let eheight = this.elementHeight();
        let elems = this._.elements;
        for (let elem of elems) {
            elem.cx(x + ewidth / 2)
            elem.cy(y + eheight / 2);
            x += ewidth;
        }
        this._.width = ewidth * elems.length;
        this._.height = eheight;
        this.children.update();
        return this;
    }
}