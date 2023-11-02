import { Node } from "../../Node/Node";
import { Line } from "../Basic/Line";
import * as Rule from "../../Rule/Rule";
import { Interact } from "../../Interact/Interact";
import { AbsElement } from "./AbsElement";
import { Text } from "../Basic/Text";
import { Traiter } from "../../Utility/TypeTrait";

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

    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
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

function x(x) {
    let back = this.children.child("background");
    if (x === undefined) return back.x();
    back.x(x); this.update();
    return this;
}

function y(y) {
    let back = this.children.child("background");
    if (y === undefined) return back.y();
    back.y(y); this.update();
    return this;
}

function width(width) {
    let back = this.children.child("background");
    if (width === undefined) return back.width();
    back.width(width); this.update();
    return this;
}

function height(height) {
    let back = this.children.child("background");
    if (height === undefined) return back.height();
    back.height(height); this.update();
    return this;
}

function source(x, y) {
    let back = this.children.child("background");
    if (x === undefined) return back.source();
    back.source(x, y);
    this.update();
    return this;
}

function target(x, y) {
    let back = this.children.child("background");
    if (x === undefined) return back.target();
    back.target(x, y);
    this.update();
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
    back.parent = null;
    back.x(x).y(y);
    back.width(width);
    back.height(height);
    back.parent = this;
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