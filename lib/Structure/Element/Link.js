import { Node } from "../../Node/Node";
import { Line } from "../Basic/Line";
import * as Rule from "../../Rule/Rule";
import { Interact } from "../../Interact/Interact";
import { AbsElement } from "./AbsElement";

export function Link(node) {
    let self = {};

    self = Node(self, node);
    self = AbsElement(self);
    self.newLayer("background");
    self.newLayer("overlay");
    self.newLayer("value");
    self = Interact(self, self.layer("overlay"));
    
    let background = Line(self.layer("background"));
    self.children.push(
        "background",
        background,
        Rule.Background(self, background));

    self.source = source;
    self.target = target;
    self.extWidth = () => {};
    self.extHeight = () => {};
    self.color = color;
    self.opacity = opacity;
    self.update = update;
    self.value = value;
    self.at = at;
    self.type = () => { return "Link"; };

    self.g().attr("name", "Link");
    
    return self;
}

function source(x, y) {
    let back = this.children.child("background");
    if (x === undefined) return back.source();
    back.source(x, y);
    return this;
}

function target(x, y) {
    let back = this.children.child("background");
    if (x === undefined) return back.target();
    back.target(x, y);
    return this;
}

function value(value) {
    if (value === undefined)
        return this.children.child("value");
    if (typeof(value) === "function")
        value = value(this.layer("value"));
    let ovalue = this.children.erase("value");
    ovalue?.opacity(0).remove();
    if (!value) return this;
    value.opacity(0);
    this.children.push(
        "value", 
        value, 
        Rule.CenterOnly(this, value));
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

function at(k) {
    let back = this.children.child("background");
    return back.at(k);
}