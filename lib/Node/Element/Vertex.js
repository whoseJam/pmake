import { ElementBase } from "./ElementBase";
import { Circle } from "../Basic/Circle";
import * as Rule from "../../Rule/Rule"; 
import { Vec } from "../../Utility/Math";

export class Vertex extends ElementBase {
    constructor(node, value = null) {
        super(node);
        this.g().attr("type", "Vertex");
        let background = new Circle(this);
        this.childAs("background", background, Rule.Background());
        if (value) this.value(value);
    }

    width(width) {
        if (width === undefined) return this._.width;
        super.width(width);
        this._.height = width;
        return this;
    }

    height(height) {
        if (height === undefined) return this._.height;
        super.height(height);
        this._.width = height;
        return this;
    }

    r(r) {
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