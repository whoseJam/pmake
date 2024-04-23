import { GridBase } from "./GridBase";
import { Box } from "../Element/Box";

export class Grid extends GridBase {
    constructor(node) {
        super(node);
        this.g().attr("type", "Grid");
        this.newLayer("elements");
        this._.elementWidth = 40;
        this._.elementHeight = 40;
        this._.x = 0;
        this._.y = 0;
        this._.width = 0;
        this._.height = 0;
    }

    elementWidth(width) {
        if (width === undefined) return this._.elementWidth;
        this._.elementWidth = width;
        this._.width = width * this.m();
        return this;
    }

    elementHeight(height) {
        if (height === undefined) return this._.elementHeight;
        this._.elementHeight = height;
        this._.height = height * this.n();
        return this;
    }

    insert(i, j, value = null) {
        let elem = new Box(this.layer("elements"), value);
        this.insertByGridBase(i, j, elem);
        this._.width = this.elementWidth() * this.m();
        this._.height = this.elementHeight() * this.n();
        elem.events.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        elem.events.enterFlag = true;
        return this;
    }

    erase(i, j) {
        let elem = this.element(i, j);
        this.eraseByGridBase(i, j);
        this._.width = this.elementWidth() * this.m();
        this._.height = this.elementHeight() * this.n();
        elem.opacity(0).remove();
        return this;
    }

    update() {
        let x = this.x();
        let y = this.y();
        let ewidth = this.elementWidth();
        let eheight = this.elementHeight();
        let elems = this._.elements;
        for (let i = 0; i < elems.length; i++) {
            if (!elems[i]) continue;
            for (let j = 0; j < elems[i].length; j++) {
                let elem = elems[i][j];
                let locx = x + j * ewidth;
                let locy = y + i * eheight;
                const move = () => {
                    elem.width(ewidth);
                    elem.height(eheight);
                    elem.x(locx).y(locy);
                };
                if (elem.events.enterFlag) {
                    elem.events.enter(elem, move);
                    elem.events.enterFlag = false;
                } else move();
            }
        }
        this.children.update();
        return this;
    }
}