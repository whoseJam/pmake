import { Background } from "@/Rule/Background";

import { Rect }        from "@/Node/Nake/Rect";
import { BaseElement } from "@/Node/Element/BaseElement";

export function Box(parent, value) {
    BaseElement.call(this, parent);
    
    this.type("Box");

    this.children.push("background", new Rect(this.layer("background")), Background());
    
    this.value(value);
}

Box.prototype = {
    ...BaseElement.prototype
};
