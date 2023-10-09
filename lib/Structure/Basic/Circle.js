import * as Basic from "./Basic";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { Vec, equal } from "../../Utility/Math";
import { Color } from "../../Utility/Color";

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
    self.set("handle", 
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

    self.basic = Basic.basic;
    self.remove = Basic.remove;
    self.transition = Basic.transition;
    self.inRange = inRange;
    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
    self.r = r;
    self.fill = Basic.fill;
    self.fillOpacity = Basic.fillOpacity;
    self.stroke = Basic.stroke;
    self.strokeOpacity = Basic.strokeOpacity;
    self.strokeWidth = Basic.strokeWidth;
    self.color = Basic.color;
    self.opacity = Basic.opacity;
    self.clickable = Basic.clickable;
    self.update = Basic.update;
    self.type = () => { return "Circle"; };

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
    Basic.prop.call(this, "attr", ["cx", r + x], "attr.cx");
    this.children.update();
    this.call("on_x");
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
    Basic.prop.call(this, "attr", ["cy", r + y], "attr.cy");
    this.children.update();
    this.call("on_y");
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
    Basic.prop.call(this, "attr", ["r", r], "attr.r");
    this.children.update();
    this.call("on_width");
    this.call("on_height");
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