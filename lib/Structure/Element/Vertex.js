import { Node } from "../../Node/Node";
import { Circle } from "../Basic/Circle";
import * as Rule from "../../Rule/Rule";
import { Interact } from "../../Interact/Interact";
import { AbsElement } from "./AbsElement";
import { equal } from "../../Utility/Math";

export function Vertex(node) {
    let self = {};

    self = Node(self, node, "Vertex");
    self = AbsElement(self);
    self.newLayer("background");
    self.newLayer("overlay");
    self.newLayer("value");
    self = Interact(self, self.layer("overlay"));

    let background = Circle(self.layer("background"));
    self.children.push(
        "background",
        background,
        Rule.Background(self, background));
    
    self.extWidth = extWidth;
    self.extHeight = extHeight;

    return self;
}

function extWidth(width) {
    this._.width = width;
    let height = this._.height;
    if (!equal(height, width)) this.height(width);
    return this;
}

function extHeight(height) {
    this._.height = height;
    let width = this._.width;
    if (!equal(width, height)) this.width(height);
    return this;
}