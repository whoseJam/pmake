import { GridBase } from "./GridBase";
import { Box } from "../Element/Box";

export class Grid extends GridBase {
    constructor(node) {
        super(node);
        this.g().attr("type", "Grid");
        this.newLayer("elements");
        this._.elementWidth = 40;
        this._.elementHeight = 40;
        this._.width = 0;
        this._.height = 0;
    }

    elementWidth(width) {
        if (width === undefined)
            return this._.elementWidth;
        this._.elementWidth = width;
        this._.width = width * this.m();
        this.update();
        return this;
    }

    elementHeight(height) {
        if (height === undefined)
            return this._.elementHeight;
        this._.elementHeight = height;
        this._.height = height * this.n();
        this.update();
        return this;
    }

    insert(i, j, value = null) {
        let elem = new Box(this.layer("elements"), value);
        super.insert(i, j, elem);
        this._.width = this.elementWidth() * this.m();
        this._.height = this.elementHeight() * this.n();
        this.update();
        elem.opacity(0).startAnimate(this).opacity(1);
        return this;
    }

    insertByGridBase(i, j, elem) {
        super.insert(i, j, elem);
        this.update();
        elem.opacity(0).startAnimate(this).opacity(1);
        return this;
    }

    erase(i, j) {
        super.erase(i, j);
        this._.width = this.elementWidth() * this.m();
        this._.height = this.elementHeight() * this.n();
    }

    eraseByGridBase(i, j) {
        super.erase(i, j);
    }

    update() {
        let x = this.x();
        let y = this.y();
        let ewidth = this.elementWidth();
        let eheight = this.elementHeight();
        let elems = this._.elements;
        console.log("elems=", elems, this._.x);
        for (let i = 0; i < elems.length; i++) {
            if (!elems[i]) continue;
            for (let j = 0; j < elems[i].length; j++) {
                let elem = elems[i][j];
                console.log("i=", i, "j=", j);
                elem.x(x + j * ewidth).y(y + i * eheight).width(ewidth).height(eheight);
                console.log("x=", x + j * ewidth, x, j, ewidth, "y=", y + i * eheight)
            }
        }
        this.children.update();
        return this;
    }
}