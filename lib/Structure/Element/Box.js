import { Node } from "../../Node/Node";
import { Rect } from "../Basic/Rect";
import * as Rule from "../../Rule/Rule"; 
import { Interact } from "../../Interact/Interact";
import { AbsElement } from "./AbsElement";
import { Traiter } from "../../Utility/TypeTrait";
import { Text } from "../Basic/Text";

export function Box(node) {
    let self = {};

    self = Node(self, node);
    self = AbsElement(self);
    self.newLayer("background");
    self.newLayer("overlay");
    self.newLayer("value");
    self = Interact(self, self.layer("overlay"));
    
    let background = Rect(self.layer("background"));
    self.children.push(
        "background",
        background,
        Rule.Background(self, background));

    self.extWidth = () => {};
    self.extHeight = () => {};
    self.color = color;
    self.opacity = opacity;
    self.update = update;
    self.value = value;
    self.inRange = inRange;
    self.type = () => { return "Box"; };

    self.g().attr("name", "Box");
    
    return self;
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
    this.preIn()(value);
    this.children.push(
        "value", 
        value, 
        Rule.CenterFixAspect(this, value));
    this.in()(value);
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
    return this;
}

function color(color) {
    this.children.child("background").color(color);
    return this;
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