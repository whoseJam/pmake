import { ElementBase } from "./ElementBase";
import { Circle } from "../Basic/Circle";
import * as Rule from "../../Rule/Rule"; 

export class Vertex extends ElementBase {
    constructor(node) {
        super(node);
        this.g().attr("type", "Vertex");
        let background = new Circle(this);
        this.newLayer("value");
        this.childAs("background", background, Rule.Background());
    }

    width(width) {
        if (width === undefined)
            return this._.width;
        super.width(width);
        this.height(width);
        return this;
    }

    height(height) {
        if (height === undefined)
            return this._.height;
        super.height(height);
        this.width(height);
        return this;
    }
}