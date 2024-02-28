import { Rect } from "../Basic/Rect";
import { Array } from "./Array";

export class BarArray extends Array {
    constructor(node) {
        super(node);
        this.g().attr("type", "BarArray");
        this._.width = 0;
        this._.height = 0;
    }

    insert(idx, value) {
        let elem = new Rect(this.layer("elements"));
        elem._.value = value;
        elem.value = function(value) {
            if (value === undefined)
                return this._.value;
            this._.value = value;
            return this;
        }
        super.insertByArrayBase(idx, elem);
        return this;
    }

    update() {
        let x = this.x(), y = this.my();
        let width = this.elementWidth();
        let height = this.elementHeight();
        let elems = this._.elements;
        for (let elem of elems) {
            elem.width(width);
            elem.height(height * elem.value());
            elem.x(x).my(y);
            x += width;
        }
        this.children.update();
        return this;
    }
}