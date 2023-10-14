import * as Basic from "./Basic";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { Vec, equal } from "../../Utility/Math";
import { Color } from "../../Utility/Color";
import { AbsBasic } from "./Basic";
import { D3Helper } from "../../Utility/D3Helper";

export function Circle(conf) {
    let mode = "normal";
    let svg = conf;
    if (typeof(conf.hsj) !== "undefined") {
        mode = conf.mode ? conf.mode : mode;
        svg = conf.svg;
    }
    
    let self = {};
    self = Node(self, svg);
    self.set("cx", 20);
    self.set("cy", 20);
    self.set("r", 20);
    self.set("fill", Color.white);
    self.set("fillOpacity", 1);
    self.set("stroke", Color.black);
    self.set("strokeOpacity", 1);
    self.set("strokeWidth", 1);
    self.set("opacity", 1);
    self.set("d3", 
        self.get("group").append("circle")
            .attr("cx", self.get("cx"))
            .attr("cy", self.get("cy"))
            .attr("r", self.get("r"))
            .attr("fill", self.get("fill"))
            .attr("fill-opacity", self.get("fillOpacity"))
            .attr("stroke", self.get("stroke"))
            .attr("stroke-opacity", self.get("strokeOpacity"))
            .attr("stroke-width", self.get("strokeWidth"))
            .attr("opacity", self.get("opacity")));
    self._.basic = D3Helper.element(self._.d3);
    self._.snap = Snap(self._.basic);
    self = AbsBasic(self);

    self.inRange = inRange;
    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
    self.r = r;
    self.type = function() { return "Circle"; };

    if (mode !== "easy") {
        self = Interact(self);
        self.nw_resize = nw_resize;
        self.ne_resize = ne_resize;
        self.sw_resize = sw_resize;
    }

    self.clickable(false);
    
    self.g().attr("name", "Circle");

    return self;
}

function inRange(vec) {
    let center = [this.cx(), this.cy()];
    let length = Vec.length(Vec.sub(vec, center))
    return length <= this.get("r");
}

function x(x) {
    let cx = this.get("cx");
    let r = this.get("r");
    let ox = cx - r;
    if (typeof(x) === "undefined")
        return ox;
    if (equal(x, ox)) return this;
    this.dirty();
    this.set("cx", r + x);
    // Basic.prop.call(this, "attr", ["cx", r + x], "attr.cx");
    this.children.update();
    this.call("onX");
    return this;
}

function y(y) {
    let cy = this.get("cy");
    let r = this.get("r");
    let oy = cy - r;
    if (typeof(y) === "undefined")
        return oy;
    if (equal(y, oy)) return this;
    this.dirty();
    this.set("cy", r + y);
    // Basic.prop.call(this, "attr", ["cy", r + y], "attr.cy");
    this.children.update();
    this.call("onY");
    return this;
}

function r(r) {
    let or = this.get("r");
    if (typeof(r) === "undefined")
        return or;
    if (equal(r, or)) return this;
    this.dirty();
    let x = this.x();
    let y = this.y();
    this.set("r", r);
    // Basic.prop.call(this, "attr", ["r", r], "attr.r");
    this.children.update();
    this.call("onWidth");
    this.call("onHeight");
    this.x(x); this.y(y);
    return this;
}

function width(width) {
    if (typeof(width) === "undefined")
        return this.r() * 2;
    return this.r(width / 2);
}

function height(height) {
    if (typeof(height) === "undefined")
        return this.r() * 2;
    return this.r(height / 2);
}

function nw_resize(e) {
    let x = this.x();
    let y = this.y();
    let width = this.width();
    let height = this.height();
    if (this.width() - e.dx >= MINW || e.dx < 0)
        this.x(x + e.dx)
            .width(width - e.dx)
            .y(y + e.dx)
            .height(height - e.dx);
}

function ne_resize(e) {
    let y = this.y();
    let width = this.width();
    let height = this.height();
    if (this.width() + e.dx >= MINW || e.dx > 0)
        this.y(y - e.dx)
            .height(height + e.dx)
            .width(width + e.dx);
}

function sw_resize(e) {
    let x = this.x();
    let width = this.width();
    let height = this.height();
    if (this.width() - e.dx >= MINW || e.dx < 0)
        this.x(x + e.dx)
            .width(width - e.dx)
            .height(height - e.dx);
}