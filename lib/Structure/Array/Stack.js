import { Node } from "../../Node/Node";
import { Text } from "../Basic/Text";
import { AbsArray } from "./AbsArray";
import { Box } from "../Element/Box";
import { Interact } from "../../Interact/Interact";

/*
   elementWidth/elementHeight
-> width/height
-> extWidth/extHeight
-> onWidth/onHeight
*/

export function Stack(node) {
    let answ = {};

    answ = Node.call(answ, node);
    answ = AbsArray.call(answ);
    answ.newLayer("elements");
    answ.newLayer("overlay");
    answ.newLayer("values");
    answ = Interact(answ, answ.layer("overlay"));

    answ.set("elementWidth", 40);
    answ.set("elementHeight", 40);
    answ.set("elementType", Box);
    answ.set("elements", []);

    answ.extWidth = extWidth;
    answ.extHeight = extHeight;
    answ.elementWidth = elementWidth;
    answ.elementHeight = elementHeight;
    answ.elementType = elementType;
    answ.push = push;
    answ.erase = erase;
    answ.update = update;
    answ.type = () => { return "Stack"; };
    
    answ.elementWidth(40);
    answ.elementHeight(40);
    answ.g().attr("name", "Stack");

    return answ;
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
    this.height(height * this.length());
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

    let height = this.height() + this.elementHeight();
    this.height(height);
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

    let height = this.height() - this.elementHeight();
    this.height(height);
    return this;
}
