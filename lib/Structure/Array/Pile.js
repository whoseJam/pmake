import { Interact } from "../../Interact/Interact";
import { Node } from "../../Node/Node";
import { AbsArray } from "./AbsArray";
import { Text } from "../Basic/Text";
import { Box } from "../Element/Box";

export function Pile(node) {
    let self = {};

    self = Node(self, node);
    self = AbsArray(self);
    self.newLayer("elements");
    self.newLayer("overlay");
    self.newLayer("values");
    self = Interact(self, self.layer("overlay"));

    self.set("elementWidth", 40);
    self.set("elementHeight", 40);
    self.set("elementType", Box);
    self.set("elements", []);

    self.extWidth = extWidth;
    self.extHeight = extHeight;
    self.elementWidth = elementWidth;
    self.elementHeight = elementHeight;
    self.elementType = elementType;
    self.push = push;
    self.erase = erase;
    self.update = update;
    self.type = () => { return "Pile"; };

    self.elementWidth(40);
    self.elementHeight(40);
    self.g().attr("name", "Pile");

    return self;
}

function update() {
    let x = this.x();
    let y = this.y();
    let ewidth = this.elementWidth();
    let eheight = this.elementHeight();
    let elems = this.get("elements");
    for (let i = 0; i < this.length(); i++) {
        let elem = elems[i];
        elem.parent = null;
        elem.x(x).y(y).width(ewidth).height(eheight);
        elem.parent = this;
        y += eheight;
    }
    this.isDirty = false;
    this.children.update();
}

function extWidth(width) {
    this.set("elementWidth", width);
}

function extHeight(height) {
    let div = Math.max(1, this.length());
    this.set("elementHeight", height / div);
}

function elementWidth(width) {
    if (width === undefined)
        return this.get("elementWidth");
    this.set("elementWidth", width);
    this.width(width);
    return this;
}

function elementHeight(height) {
    if (height === undefined)
        return this.get("elementHeight");
    this.set("elementHeight", height);
    this.height(height, this.length());
    return this;
}

function elementType(type) {
    if (type === undefined)
        return this.get("elementType");
    this.set("elementType", type);
    return this;
}


function push(value = null) {
    if (typeof(value) === "number" || typeof(value) === "string")
        value = Text(this.layer("values"), value);
    else if (value === "function")
        value = value(this.layer("values"));
    
    let elem = this.elementType()(this.layer("elements"));
    let elems = this.get("elements");
    elems.push(elem.value(value));
    this.children.push(elem);
    this.preIn()(elem);
    this.update();
    this.in()(elem);

    let y = this.y() - this.elementHeight();
    let height = this.height() + this.elementHeight();
    this.y(y).height(height);
    return this;
}

function erase(i) {
    let elem = this.element(i);
    let elems = this.get("elements");
    elems.splice(this.idx(i), 1);
    this.children.erase(elem);
    this.preOut()(elem);
    this.update();
    this.out()(elem);

    let y = this.y() + this.elementHeight();
    let height = this.height() - this.elementWidth();
    this.y(y).height(height);
    return this;
}
