import { Const } from "../../Utility/Const";
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

    // --------------------插入函数--------------------
    insert(idx, value) {
        value.attachTo(this.layer("elements"));
        this.insertByArrayBase(idx, value);
        value._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty(this, "U");
        return this;
    }
    insertFromExist(idx, value) {
        value.attachTo(this.layer("elements"));
        this.insertByArrayBase(idx, value);
        value._.enter = (elem, move) => {
            elem.startAnimate(this);
            move();
        };
        this.dirty(this, "U");
        return this;
    }

    update() {
        this.preUpdate();
        let x = this.x();
        const y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this._.elements;
        for (let elem of elements) {
            function move() {
                elem.cx(x + elementWidth / 2)
                elem.cy(y + elementHeight / 2);
            }
            if (elem._.enter) {
                elem._.enter(elem, move);
                elem._.enter = undefined;
            } else move();
            x += elementWidth;
        }
        this._.width = elementWidth * elements.length;
        this._.height = elementHeight;
        this.postUpdate();
        return this;
    }
}