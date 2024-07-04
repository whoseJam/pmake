import { Background } from "@/Rule/Background";
import { BaseElement } from "./BaseElement";
import { Rect } from "@/Node/Nake/Rect";

export function Box(parent, value = undefined) {
    BaseElement.call(this, parent);
    
    this.g().type("Box");

    this.children.push(
        "background",
        new Rect(this.layer("background")),
        Background())

    if (value) {
        this.value(value);
    }
}

Box.prototype = {
    ...BaseElement.prototype
};
