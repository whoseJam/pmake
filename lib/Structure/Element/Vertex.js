import { Node } from "../../Node/Node";
import { Circle } from "../Basic/Circle";
import * as Rule from "../../Rule/Rule";
import { Interact } from "../../Interact/Interact";
import { AbsElement } from "./AbsElement";
import { equal } from "../../Utility/Math";
import { Text } from "../Basic/Text";
import { Traiter } from "../../Utility/TypeTrait";

export function Vertex(node) {
    let self = {};

    self = Node(self, node);
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
    self.color = color;
    self.opacity = opacity;
    self.update = update;
    self.value = value;
    self.inRange = inRange;
    self.type = () => { return "Vertex"; };

    self.g().attr("name", "Vertex");

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

function value(value) {
    if (value === undefined)
        return this.children.child("value");
    if (typeof(value) === "function")
        value = value(this.layer("value"));
    else if (Traiter.isText(value))
        value = Text(this.layer("value"), value);
    let ovalue = this.children.erase("value");
    ovalue?.opacity(0).remove();
    if (!value) return this;
    value.opacity(0);
    this.children.push(
        "value", 
        value, 
        Rule.CenterFixAspect(this, value));
    value.startAnimate(this);
    value.opacity(1);
    return this;
}

function update() {
    let x = this.x();
    let y = this.y();
    let width = this.width();
    let height = this.height();
    let back = this.children.child("background");
    back.x(x).y(y);
    back.width(width);
    back.height(height);
    this.isDirty = false;
    this.children.update();
}

function color(color) {
    this.children.child("background").color(color);
}

function opacity(opacity) {
    this.children.child("background").opacity(opacity);
    let value = this.children.child("value");
    value?.opacity(opacity);
    return this;
}

function inRange(vec) {
    let back = this.children.child("background");
    return back.inRange(vec);
}