import { GridBase } from "./GridBase";
import { Box } from "../Element/Box";
import { Const } from "../../Utility/Const";

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
        elem._.enter = (elem, move) => {
            elem.opacity(0);
            move();
            elem.startAnimate(this).opacity(1);
        };
        this.dirty();
        return this;
    }


    erase(i, j) {
        let elem = this.element(i, j);
        this.eraseByGridBase(i, j);
        this._.width = this.elementWidth() * this.m();
        this._.height = this.elementHeight() * this.n();
        elem.startAnimate(this).opacity(0).remove();
        this.dirty();
        return this;
    }


    update() {
        this.preUpdate();
        const x = this.x();
        const y = this.y();
        const elementWidth = this.elementWidth();
        const elementHeight = this.elementHeight();
        const elements = this._.elements;
        for (let i = 0; i < elements.length; i++) {
            if (!elements[i]) continue;
            for (let j = 0; j < elements[i].length; j++) {
                const element = elements[i][j];
                const locx = x + j * elementWidth;
                const locy = y + i * elementHeight;
                const move = () => {
                    element.width(elementWidth);
                    element.height(elementHeight);
                    element.x(locx).y(locy);
                };
                if (element._.enter) {
                    element._.enter(element, move);
                    element._.enter = undefined;
                } else {
                    element.startAnimate(this);
                    move();
                }
            }
        }
        this.postUpdate();
        return this;
    }
}