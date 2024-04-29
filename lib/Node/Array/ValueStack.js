import { Const } from "../../Utility/Const";
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

    // --------------------插入函数--------------------
    insert(idx, value) {
        value.attachTo(this.layer("elements"));
        this.insertByArrayBase(idx, value);
        value._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty(Const.DirtyChannel.height);
        return this;
    }
    insertFromExist(idx, value) {
        value.attachTo(this.layer("elements"));
        this.insertByArrayBase(idx, value);
        value._.enter = (elem, move) => {
            elem.startAnimate(this);
            move();
        };
        this.dirty(Const.DirtyChannel.height);
        return this;
    }

    update() {
        this.preUpdate();
        this._.isDirty = undefined;
        this._.dirtyByMe = 0;
        const x = this.x();
        let y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this._.elements;
        for (let elem of elements) {
            function move() {
                elem.cx(x + ewidth / 2);
                elem.cy(y + eheight / 2);
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
        this.postUpdate();
        return this;
    }
}