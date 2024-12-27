import { CircleBackground } from "@/Rule/Background";

import { SDNode }      from "@/Node/SDNode";
import { Circle }      from "@/Node/Nake/Circle";
import { BaseElement } from "@/Node/Element/BaseElement";
import { Factory } from "@/Utility/Factory";
import { reactive } from "../SDNode/SDValue";

export function Vertex(parent, value) {
    BaseElement.call(this, parent);

    this.type("Vertex");

    this.vars.merge(reactive({
        r: 20
    }));

    this.childAs("background", new Circle(this.layer("background")), CircleBackground());
    
    this.value(value);
}

Vertex.prototype = {
    ...BaseElement.prototype
};

Vertex.prototype.r = Factory.handlerLowPrecise("r");
Vertex.prototype.width = Circle.prototype.width;
Vertex.prototype.height = Circle.prototype.height;
Vertex.prototype.inRange = Circle.prototype.inRange;
