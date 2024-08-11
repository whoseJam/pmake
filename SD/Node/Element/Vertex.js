import { CircleBackground } from "@/Rule/Background";

import { Circle }               from "@/Node/Nake/Circle"; 
import { BaseElement }          from "@/Node/Element/BaseElement";
import { GetterAndSetter } from "@/Node/Common";

export function Vertex(parent, value) {
    BaseElement.call(this, parent);

    this.g().type("Vertex");

    this.member.new("r", 20);

    this.childAs(
        "background",
        new Circle(this.layer("background")),
        CircleBackground());
    
    this.value(value);

    return this;
}

Vertex.prototype = {
    ...BaseElement.prototype
};

Vertex.prototype.r       = GetterAndSetter("r", "setByEqual");
Vertex.prototype.width   = Circle.prototype.width;
Vertex.prototype.height  = Circle.prototype.height;
Vertex.prototype.inRange = Circle.prototype.inRange;
