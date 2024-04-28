import { Background } from "../../Rule/Rule";
import { Circle } from "../Basic/Circle"; 
import { ElementBase } from "./ElementBase";
import { Vec } from "../../Utility/Math";

export class Vertex extends ElementBase {
    constructor(node, value = null) {
        super(node);
        this.g().attr("type", "Vertex");
        let background = new Circle(this.layer("background"));
        this.childAs("background", background, Background());
        if (value) this.value(value);
    }

    width(width) {
        this.dirtyCheck();
        if (width === undefined) return this._.width;
        this._.height = width;
        this.dirty();
        return this;
    }

    height(height) {
        this.dirtyCheck();
        if (height === undefined) return this._.height;
        this._.width = height;
        this.dirty();
        return this;
    }

    r(r) {
        this.dirtyCheck();
        if (r === undefined) return this._.width / 2;
        this.width(r * 2);
        return this;
    }

    inRange(vec) {
        let center = [this.cx(), this.cy()];
        let length = Vec.length(Vec.sub(vec, center));
        return length <= this._.r;
    }
}