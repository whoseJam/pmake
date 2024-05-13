import { Circle } from "../Basic/Circle"; 
import { CircleBackground } from "../../Rule/Background";
import { ElementBase } from "./ElementBase";
import { Vec } from "../../Utility/Math";

export class Vertex extends ElementBase {
    constructor(node, value = null) {
        super(node);
        this.g().attr("type", "Vertex");
        this._.r = 20;
        this.childAs(
            "background",
            new Circle(this.layer("background")),
            CircleBackground());
        if (value) this.value(value);
    }

    // --------------------位置函数--------------------
    inRange(vec) {
        let center = [this.cx(), this.cy()];
        let length = Vec.length(Vec.sub(vec, center));
        return length <= this.r();
    }
    width(width) {
        if (width === undefined) return this.r() * 2;
        this.r(width / 2);
        return this;
    }
    height(height) {
        if (height === undefined) return this.r() * 2;
        this.r(height / 2);
        return this;
    }
    r(r) {
        this.dirtyCheck();
        if (r === undefined) return this._.r;
        this._.r = r;
        this.dirty(this, "R");
        return this;
    }
}