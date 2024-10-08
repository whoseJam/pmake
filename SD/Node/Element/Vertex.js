import { CircleBackground } from "@/Rule/Background";

import { SDNode }      from "@/Node/SDNode";
import { Circle }      from "@/Node/Nake/Circle";
import { BaseElement } from "@/Node/Element/BaseElement";

export function Vertex(parent, value) {
    BaseElement.call(this, parent);

    this.type("Vertex");

    this.member.new("r", 20);

    this.childAs("background", new Circle(this.layer("background")), CircleBackground());
    
    this.value(value);
}

Vertex.prototype = {
    ...BaseElement.prototype
};

Vertex.prototype.r       = SDNode.OrdinaryGSet("r", "setByEqual");
Vertex.prototype.width   = Circle.prototype.width;
Vertex.prototype.height  = Circle.prototype.height;
Vertex.prototype.inRange = Circle.prototype.inRange;
