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
        value.events.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        value.events.enterFlag = true;
        this.resize();
        return this;
    }

    insertFromExist(idx, value) {
        value.attachTo(this.layer("elements"));
        this.insertByArrayBase(idx, value);
        value.events.enter = (elem, move) => {
            elem.startAnimate(this);
            move();
        };
        value.events.enterFlag = true;
        this.resize();
        return this;
    }

    update() {
        let x = this.x();
        let y = this.y();
        let ewidth = this.elementWidth();
        let eheight = this.elementHeight();
        let elems = this._.elements;
        for (let elem of elems) {
            function move() {
                elem.cx(x + ewidth / 2);
                elem.cy(y + eheight / 2);
            }
            if (elem.events.enterFlag) {
                elem.events.enter(elem, move);
                elem.events.enterFlag = false;
            } else move();
            y += eheight;
        }
        this.children.update();
        return this;
    }
}