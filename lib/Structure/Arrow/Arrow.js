import { Node } from "../../Node/Node";
import { Line } from "../Basic/Line";
import { Interact } from "../../Interact/Interact";
import { trim } from "../../slide";
import * as Rule from "../../Rule/Rule";

export function Arrow(node) {
    let self = {};

    self = Node(self, node);
    self.newLayer("background");
    self.newLayer("overlay");
    self.newLayer("value");
    self = Interact(self, self.layer("overlay"));

    let background = Line(self.layer("background"));
    background.markerEnd("arrow");
    self.children.push(
        "background",
        background,
        Rule.Background(self, background));

    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
    self.from = endpointFunc("from");
    self.to = endpointFunc("to");
    self.update = update;
    self.type = function() {
        return "Arrow";
    }

    self.g().attr("name", "Arrow");

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

function endpointFunc(name) {
    return function(elem) {
        let endpointElem = this._[name + "Elem"];
        if (endpointElem) {
            let listenIdPack = this._[name + "ElemListenIdPack"];
            endpointElem.stopListen("onX", listenIdPack.onX);
            endpointElem.stopListen("onY", listenIdPack.onY);
            endpointElem.stopListen("onWidth", listenIdPack.onWidth);
            endpointElem.stopListen("onHeight", listenIdPack.onHeight);
        }
        this._[name + "Elem"] = elem;
        this._[name + "ElemListenIdPack"] = {
            onX: elem.listen("onX", update, this),
            onY: elem.listen("onY", update, this),
            onWidth: elem.listen("onWidth", update, this),
            onHeight: elem.listen("onHeight", update, this)
        };
        this.update();
        return this;
    }
}

function update() {
    if (!this._.fromElem || !this._.toElem) return;
    let back = this.children.child("background");
    back.parent = null;
    back.source(
        this._.fromElem.cx(),
        this._.fromElem.cy());
    back.target(
        this._.toElem.cx(),
        this._.toElem.cy());
    trim(back, this._.fromElem, this._.toElem);
    back.parent = this;
    this.isDirty = false;
    this.children.update();
}