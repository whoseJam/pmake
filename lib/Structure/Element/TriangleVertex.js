import { Node } from "../../Node/Node_";
import { Triangle } from "../Polygen/Triangle";
import { AbsElement } from "./AbsElement";
import { Interact } from "../../Interact/Interact";
import * as Rule from "../../Rule/Rule";
import { SDHelper } from "../../Utility/SDHelper";
import { equal } from "../../Utility/Math";

export function TriangleVertex(node) {
    let self = {};
    self = Node(self, node, "Vertex");
    let background = Triangle(self);
    self.newLayer("overlay");
    self.newLayer("value");
    self = AbsElement(self);
    self = Interact(self, self.layer("overlay"));
    self.children.push("background", background, Rule.Background());
    self.extWidth = SDHelper.emptyFunc;
    self.extHeight = SDHelper.emptyFunc;
    self.value = value;
    self._.valueRule = Rule.TriangleCenterFixAspect();
    return self;
}

function value(value) {
    if (value === undefined)
        return this.children.child("value");
    value = SDHelper.any2Slide(this, value);
    let ovalue = this.children.erase("value");
    if (ovalue) {
        ovalue._.preOut(ovalue);
        ovalue._.out(ovalue);
    }
    if (!value) return this;
    value.attachTo(this.layer("value"));
    this._.preIn(value);
    this.children.push(
        "value", 
        value, 
        Rule.TriangleCenterFixAspect(this, value));
    this._.in(value);
    return this;
}