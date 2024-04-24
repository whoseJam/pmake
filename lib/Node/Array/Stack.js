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

    insert(idx, value = null) {
        let elem = new Box(this.layer("elements"))
        if (value !== null) elem.value(value);
        this.insertByArrayBase(idx, elem);
        elem.events.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        elem.events.enterFlag = true;
        updateSize(this);
        return this;
    }

    insertFromExistValue(idx, value) {
        console.assert(value instanceof Node);
        let elem = new Box(this.layer("elements"));
        this.insertByArrayBase(idx, elem);
        elem.events.enter = (elem, move) => {
            elem.startAnimate(this);
            move();
        };
        elem.events.enterFlag = true;
        elem.valueFromExist(value);
        updateSize(this);
        return this;
    }

    insertFromExistElement(idx, value) {
        console.assert(value instanceof Box);
        value.attachTo(this.layer("elements"));
        this.insertByArrayBase(idx, value);
        value.events.enter = (elem, move) => {
            elem.startAnimate(this);
            move();
        };
        updateSize(this);
        return this;
    }

    erase(idx) {
        let elem = this.element(idx);
        this.eraseByArrayBase(idx);
        elem.opacity(0).remove();
        updateSize(this);
        return this;
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

function updateSize(self) {
    self._.width = self.elementWidth();
    self._.height = self.length() * self.elementHeight();
}
