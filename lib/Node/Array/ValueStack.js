import { Stack } from "./Stack";

export class ValueStack extends Stack {
    constructor(node) {
        super(node);
        this.g().attr("type", "ValueStack");
        this._.x = 0;
        this._.y = 0;
        this._.width = 40;
        this._.height = 0;
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
            elem.cx(x + ewidth / 2);
            elem.cy(y + eheight / 2);
            y += eheight;
        }
        this._.width = ewidth;
        this._.height = eheight * elems.length;
        this.children.update();
        return this;
    }
}