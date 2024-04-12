import { Stack } from "./Stack";

export class ValueStack extends Stack {
    constructor(node) {
        super(node);
        this.g().attr("type", "ValueStack");
    }

    insert(idx, value = null) {
        this.insertByArrayBase(idx, value);
        value.attachTo(this.layer("elements"));
        this._.height += this.elementHeight();
        this.update();
        value.opacity(0).startAnimate(this).opacity(1);
        return this;
    }

    erase(idx) {
        let value = this.element(idx);
        this.eraseByArrayBase(idx);
        this._.height -= this.elementHeight();
        value.opacity(0).remove();
        return this;
    }

    update() {
        let x = this.x();
        let y = this.y();
        let ewidth = this.elementWidth();
        let eheight = this.elementHeight();
        let elems = this._.elements;

        for (let elem of elems) {
            elem.cx(x + ewidth / 2).cy(y + eheight / 2);
            y += eheight;
        }
        this.children.update();
        return this;
    }
}