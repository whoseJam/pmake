import { Circle } from "@/Node/Nake/Circle"; 
import { CircleBackground } from "@/Rule/Background";
import { BaseElement } from "./BaseElement";
import { Vec } from "@/Utility/Math";

export function Vertex(parent, value = null) {
    BaseElement.call(this, parent);

    this.g().type("Vertex");

    this.member.new("r", 20);

    this.childAs(
        "background",
        new Circle(this.layer("background")),
        CircleBackground());
    
    if (value) {
        this.value(value);
    }

    return this;
}

Vertex.prototype = {
    ...BaseElement.prototype
};

Vertex.prototype.inRange = function(vec) {
    const center = [this.cx(), this.cy()];
    const length = Vec.length(Vec.sub(vec, center));
    return length <= this.r();
}

Vertex.prototype.width = function(width) {
    if (width === undefined) return this.r() * 2;
    this.r(width / 2);
    return this;
}

Vertex.prototype.height = function(height) {
    if (height === undefined) return this.r() * 2;
    this.r(height / 2);
    return this;
}

Vertex.prototype.r = function(r) {
    if (r === undefined) {
        return this.member.get("r");
    }
    this.member.setByEqual("r", r);
    this.tryUpdate();
    return this;
}