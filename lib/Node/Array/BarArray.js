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
        let self = this;
        let elem = new Rect(this.layer("elements"));
        elem._.value = value;
        elem.value = function(value) {
            if (value === undefined)
                return this._.value;
            this._.value = value;
            let my = this.my();
            this.height(self.elementHeight() * value).my(my);
            return this;
        }
        this._.width += this.elementWidth();
        super.insertByArrayBase(idx, elem);
        return this;
    }

    update() {
        let x = this.x(), y = this.my();
        let width = this.elementWidth();
        let height = this.elementHeight();
        let elems = this._.elements;
        let maxHeight = 0;
        for (let elem of elems) {
            elem.width(width);
            elem.height(height * elem.value());
            elem.x(x).my(y);
            maxHeight = Math.max(maxHeight, height * elem.value());
            x += width;
        }
        this._.height = maxHeight;
        this.children.update();
        return this;
    }
}