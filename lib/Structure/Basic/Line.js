import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { Vec, equal } from "../../Utility/Math";
import { Color } from "../../Utility/Color";
import { AbsBasic } from "./Basic";
import { D3Helper } from "../../Utility/D3Helper";
import { SnapHelper } from "../../Utility/SnapHelper";

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
    self.set("d3",
        self.get("group").append("line")
            .attr("x1", self.get("x1"))
            .attr("y1", self.get("y1"))
            .attr("x2", self.get("x2"))
            .attr("y2", self.get("y2"))
            .attr("stroke", self.get("stroke"))
            .attr("stroke-opacity", self.get("strokeOpacity"))
            .attr("stroke-width", self.get("strokeWidth"))
            .attr("opacity", self.get("opacity")));
    self._.basic = D3Helper.element(self._.d3)
    self._.snap = Snap(self._.basic);
    self = AbsBasic(self);

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
    self.markerStart = markerStart;
    self.markerMid = markerMid;
    self.markerEnd = markerEnd;
    self.type = function() {
        return "Line";
    }

    self = Interact(self);

    self.clickable(false);

    self.g().attr("name", "Line");

    return self;
}

function at(k) {
    let v1 = [this.x1(), this.y1()];
    let v2 = [this.x2(), this.y2()];
    let d = Vec.sub(v2, v1);
    return Vec.add(v1, Vec.numberMul(d, k));
}

function source(x, y) {
    if (x === undefined)
        return [this.x1(), this.y1()];
    this.x1(x).y1(y);
    return this;
}

function target(x, y) {
    if (y === undefined)
        return [this.x2(), this.y2()];
    this.x2(x).y2(y);
    return this;
}

function x(x) {
    let x1 = this.x1();
    let x2 = this.x2();
    let ox = Math.min(x1, x2);
    if (x === undefined)
        return ox;
    let dx = x - ox;
    this.x1(x1 + dx);
    this.x2(x2 + dx);
    this.call("onX");
    return this;
}

function y(y) {
    let y1 = this.y1();
    let y2 = this.y2();
    let oy = Math.min(y1, y2);
    if (y === undefined)
        return oy;
    let dy = y - oy;
    this.y1(y1 + dy);
    this.y2(y2 + dy);
    this.call("onY");
    return this;
}

function x1(x) {
    let ox1 = this.get("x1");
    if (x === undefined)
        return ox1;
    if (equal(x, ox1)) return this;
    this.dirty();
    this.set("x1", x);
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "x1",
            value: x
        })
    );
    this.children.update();
    this.call("onX");
    this.call("onWidth");
    return this;
}

function x2(x) {
    let ox2 = this.get("x2");
    if (x === undefined)
        return ox2;
    if (equal(x, ox2)) return this;
    this.dirty();
    this.set("x2", x);
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "x2",
            value: x
        })
    );
    this.children.update();
    this.call("onX");
    this.call("onWidth");
    return this;
}

function y1(y) {
    let oy1 = this.get("y1");
    if (y === undefined)
        return oy1;
    if (equal(y, oy1)) return this;
    this.dirty();
    this.set("y1", y);
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "y1",
            value: y
        })
    );
    this.children.update();
    this.call("onY");
    this.call("onHeight");
    return this;
}

function y2(y) {
    let oy2 = this.get("y2");
    if (y === undefined)
        return oy2;
    if (equal(y, oy2)) return this;
    this.dirty();
    this.set("y2", y);
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "y2",
            value: y
        })
    );
    this.children.update();
    this.call("onY");
    this.call("onHeight");
    return this;
}

function width(width) {
    if (width === undefined)
        return Math.abs(this.get("x1") - this.get("x2"));
    let x1 = this.get("x1");
    let x2 = this.get("x2");
    if (x1 < x2) this.x2(x1 + width);
    else this.x1(x2 + width);
    return this;
}

function height(height) {
    if (height === undefined)
        return Math.abs(this.get("y1") - this.get("y2"));
    let y1 = this.get("y1");
    let y2 = this.get("y2");
    if (y1 < y2) this.y2(y1 + height);
    else this.y1(y2 + height);
    return this;
}

function markerStart(mark) {
    if (mark === undefined)
        return this.get("markerStart");
    this.set("markerStart", mark, true);
    mark = (typeof(mark) === "string" ? "url(#" + mark + ")" : "");
    this.animate.launch(
        D3Helper.action({
            elem: this._.d3,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "marker-start",
            value: mark
        })
    );
    return this;
}

function markerMid(mark) {
    if (mark === undefined)
        return this.get("marker_mid");
    this.set("marker_mid", mark, true);
    mark = (typeof(mark) === "string" ? "url(#" + mark + ")" : "");
    this.animate.launch(
        D3Helper.action({
            elem: this._.d3,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "marker-mid",
            value: mark
        })
    );
    return this;
}

function markerEnd(mark) {
    if (mark === undefined)
        return this.get("marker_end");
    this.set("markerEnd", mark, true);
    mark = (typeof(mark) === "string" ? "url(#" + mark + ")" : "");
    this.animate.launch(
        D3Helper.action({
            elem: this._.d3,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "marker-end",
            value: mark
        })
    );
    return this;
}