import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { Vec, equal } from "../../Utility/Math";
import { Color } from "../../Utility/Color";
import * as Basic from "./Basic";

export function Line(conf) {
    let mode = "normal";
    let svg = conf;
    if (typeof(conf.hsj) !== "undefined") {
        mode = conf.modee ? conf.mode : mode;
        svg = conf.svg;
    }

    let self = {};
    self = Node(self, svg);

    self.set("x1", 0);
    self.set("y1", 0);
    self.set("x2", 100);
    self.set("y2", 0);
    self.set("stroke", Color.black);
    self.set("strokeOpacity", 1);
    self.set("strokeWidth", 1);
    self.set("opacity", 1);
    self.set("markerStart", null);
    self.set("markerMid", null);
    self.set("markerEnd", null);
    self.set("handle",
        self.get("group").append("line")
            .attr("x1", self.get("x1"))
            .attr("y1", self.get("y1"))
            .attr("x2", self.get("x2"))
            .attr("y2", self.get("y2"))
            .attr("stroke", self.get("stroke"))
            .attr("stroke-opacity", self.get("strokeOpacity"))
            .attr("stroke-width", self.get("strokeWidth"))
            .attr("opacity", self.get("opacity")));

    self.basic = Basic.basic;
    self.remove = Basic.remove;
    self.transition = Basic.transition;
    self.x = x;
    self.y = y;
    self.x1 = x1;
    self.y1 = y1;
    self.x2 = x2;
    self.y2 = y2;
    self.width = width;
    self.height = height;
    self.source = source;
    self.target = target;
    self.at = at;
    self.stroke = Basic.stroke;
    self.strokeOpacity = Basic.strokeOpacity;
    self.strokeWidth = Basic.strokeWidth;
    self.color = Basic.color;
    self.opacity = Basic.opacity;
    self.markerStart = markerStart;
    self.markerMid = markerMid;
    self.markerEnd = markerEnd;
    self.clickable = Basic.clickable;
    self.update = Basic.update;
    self.type = () => { return "Line"; };

    if (mode !== "easy") {
        self = Interact(self);
    }

    self.clickable(false);

    self.g().attr("name", "Line");

    return self;
}

function at(k) {
    let v1 = [this.x1(), this.y1()];
    let v2 = [this.x2(), this.y2()];
    let d = Vec.sub(v2, v1);
    return Vec.add(v1, Vec.number_mul(d, k));
}

function source(x, y) {
    if (typeof(x) === "undefined")
        return [this.x1(), this.y1()];
    this.x1(x).y1(y);
    return this;
}

function target(x, y) {
    if (typeof(y) === "undefined")
        return [this.x2(), this.y2()];
    this.x2(x).y2(y);
    return this;
}

function x(x) {
    let x1 = this.x1();
    let x2 = this.x2();
    let cur_x = Math.min(x1, x2);
    if (typeof(x) === "undefined")
        return cur_x;
    let dx = x - cur_x;
    this.x1(x1 + dx);
    this.x2(x2 + dx);
    this.call("onX");
    return this;
}

function y(y) {
    let y1 = this.y1();
    let y2 = this.y2();
    let cur_y = Math.min(y1, y2);
    if (typeof(y) === "undefined")
        return cur_y;
    let dy = y - cur_y;
    this.y1(y1 + dy);
    this.y2(y2 + dy);
    this.call("onY");
    return this;
}

function x1(x) {
    let ox1 = this.get("x1");
    if (typeof(x) === "undefined")
        return ox1;
    if (equal(x, ox1)) return this;
    this.dirty();
    this.set("x1", x);
    Basic.prop.call(this, "attr", ["x1", x], "attr.x1");
    this.children.update();
    this.call("onX");
    this.call("onWidth");
    return this;
}

function x2(x) {
    let ox2 = this.get("x2");
    if (typeof(x) === "undefined")
        return ox2;
    if (equal(x, ox2)) return this;
    this.dirty();
    this.set("x2", x);
    Basic.prop.call(this, "attr", ["x2", x], "attr.x2");
    this.children.update();
    this.call("onX");
    this.call("onWidth");
    return this;
}

function y1(y) {
    let oy1 = this.get("y1");
    if (typeof(y) === "undefined")
        return oy1;
    if (equal(y, oy1)) return this;
    this.dirty();
    this.set("y1", y);
    Basic.prop.call(this, "attr", ["y1", y], "attr.y1");
    this.children.update();
    this.call("onY");
    this.call("onHeight");
    return this;
}

function y2(y) {
    let oy2 = this.get("y2");
    if (typeof(y) === "undefined")
        return oy2;
    if (equal(y, oy2)) return this;
    this.dirty();
    this.set("y2", y);
    Basic.prop.call(this, "attr", ["y2", y], "attr.y2");
    this.children.update();
    this.call("onY");
    this.call("onHeight");
    return this;
}

function width(width) {
    if (typeof(width) === "undefined")
        return Math.abs(this.get("x1") - this.get("x2"));
    let x1 = this.get("x1");
    let x2 = this.get("x2");
    if (x1 < x2) this.x2(x1 + width);
    else this.x1(x2 + width);
    return this;
}

function height(height) {
    if (typeof(height) === "undefined")
        return Math.abs(this.get("y1") - this.get("y2"));
    let y1 = this.get("y1");
    let y2 = this.get("y2");
    if (y1 < y2) this.y2(y1 + height);
    else this.y1(y2 + height);
    return this;
}

function markerStart(mark) {
    if (typeof(mark) === "undefined")
        return this.get("markerStart");
    this.set("markerStart", mark, true);
    mark = (typeof(mark) === "string" ? "url(#" + mark + ")" : "");
    Basic.prop.call(this, "attr", ["marker-start", mark], "attr.marker-start");
    return this;
}

function markerMid(mark) {
    if (typeof(mark) === "undefined")
        return this.get("marker_mid");
    this.set("marker_mid", mark, true);
    mark = (typeof(mark) === "string" ? "url(#" + mark + ")" : "");
    Basic.prop.call(this, "attr", ["marker-mid", mark], "attr.marker-mid");
    return this;
}

function markerEnd(mark) {
    if (typeof(mark) === "undefined")
        return this.get("marker_end");
    this.set("markerEnd", mark, true);
    mark = (typeof(mark) === "string" ? "url(#" + mark + ")" : "");
    Basic.prop.call(this, "attr", ["marker-end", mark], "attr.marker-end");
    return this;
}