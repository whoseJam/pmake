import * as Basic from "./Basic";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { Traiter } from "../../Utility/TypeTrait";
import { Color } from "../../Utility/Color";
import { equal } from "../../Utility/Math";
import { timeout } from "d3";
import { AbsBasic } from "./Basic";
import { D3Helper } from "../../Utility/D3Helper";

let helper;
export function INIT_TEXT(svg) {
    helper = svg.append("text")
        .attr("stroke-opacity", 0)
        .attr("fill-opacity", 0);
}

function parseText(txt) {
    let ans = ""; txt = String(txt);
    for (let i = 0; i < txt.length; i++) {
        if (txt[i] === " ") ans += "\&emsp;";
        else if (txt[i] === "<") ans += "\&lt;";
        else if (txt[i] === ">") ans += "\&gt;";
        else ans += txt[i];
    }
    return ans;
}

function setText(handle, text) {
    D3Helper.element(handle).innerHTML = text;
}

export const TextTool = {
    fs2width: fs2height,
    fs2height: fs2height,
    width2fs: width2fs,
    height2fs: height2fs
};

export function Text(conf, t = "empty") {
    let mode = "normal";
    let svg = conf;
    if (typeof(conf.hsj) !== "undefined") {
        mode = conf.mode ? conf.mode : mode;
        svg = conf.svg;
    }

    let self = {};
    self = Node(self, svg);
    self = AbsBasic(self);
    
    self.set("x", 0);
    self.set("y", 0);
    self.set("width", 0);
    self.set("height", 0);
    self.set("text", parseText(t));
    self.set("fontSize", 15);
    self.set("fontFamily", "consolas");
    self.set("fontWeight", 1);
    self.set("fill", Color.black);
    self.set("fillOpacity", 0);
    self.set("stroke", Color.black);
    self.set("stroke_opacity", 1);
    self.set("stroke_width", 0);
    self.set("opacity", 1);
    self.set("handle", 
        self.get("group").append("text")
            .attr("text-anchor", "start")
            .attr("dy", ".92em")
            .attr("x", self.get("x"))
            .attr("y", self.get("y"))
            .attr("font-size", self.get("fontSize"))
            .attr("font-family", self.get("fontFamily"))
            .attr("font-weight", self.get("fontWeight"))
            .attr("fill", self.get("fill"))
            .attr("fill-opaicty", self.get("fillOpacity"))
            .attr("stroke", self.get("stroke"))
            .attr("stroke-opacity", self.get("stroke_opacity"))
            .attr("stroke-width", self.get("stroke_width"))
            .attr("opacity", self.get("opacity")));

    self.basic = Basic.basic;
    self.remove = Basic.remove;
    self.transition = Basic.transition;
    self.inRange = Basic.inRange;
    self.x = Basic.x;
    self.y = Basic.y;
    self.width = width;
    self.height = height;
    self.text = text;
    self.fontSize = fontSize;
    self.fontWeight = fontWeight;
    self.fontFamily = fontFamily;
    self.fill = Basic.fill;
    self.fillOpacity = Basic.fillOpacity;
    self.stroke = Basic.stroke;
    self.strokeOpacity = Basic.strokeOpacity;
    self.strokeWidth = Basic.strokeWidth;
    self.color = Basic.color;
    self.opacity = Basic.opacity;
    self.clickable = Basic.clickable;
    self.update = Basic.update;
    self.type = () => { return "Text"; };

    if (mode !== "easy") {
        self = Interact(self);

        self.nw_resize = nw_resize;
        self.ne_resize = ne_resize;
        self.sw_resize = sw_resize;
    }

    self.clickable(false);

    self.text(self.get("text"));
    
    self.g().attr("name", "Text");

    return self;
}

function width(width) {
    let ow = this.get("width");
    if (typeof(width) === "undefined")
        return ow;
    if (equal(width, ow)) return this;
    this.fontSize(width2fs(
        this.text(), 
        this.fontFamily(), 
        width));
    return this;
}

function height(height) {
    let oh = this.get("height");
    if (typeof(h) === "undefined")
        return oh;
    if (equal(height, oh)) return this;
    this.fontSize(height2fs(
        this.text(),
        this.fontFamily(),
        height));
    return this;
}

function text(text) {
    if (typeof(text) === "undefined")
        return this.get("text");
    text = String(text);
    this.set("text", text);
    text = parseText(text);
    let handle = this.get("handle");
    if (this.delay() + this.duration() >= 100) {
        timeout(() => {
            setText(handle, text);
        }, this.delay() + this.duration());
    } else setText(handle, text);
    this.set("width", fs2width(this.text(), this.fontFamily(), this.fontSize()));
    this.set("height", fs2height(this.text(), this.fontFamily(), this.fontSize()));
    this.children.update();
    this.call("onX"); this.call("onWidth");
    this.call("onY"); this.call("onHeight");
    return this;
}

function fontSize(fs) {
    let ofs = this.get("fontSize");
    if (typeof(fs) === "undefined")
        return ofs;
    if (equal(fs, ofs)) return this;
    if (!Traiter.isValidNumber(fs)) return this;
    this.dirty();
    this.set("fontSize", fs);
    this.set("width", fs2width(this.text(), this.fontFamily(), this.fontSize()));
    this.set("height", fs2height(this.text(), this.fontFamily(), this.fontSize()));
    Basic.prop.call(this, "attr", ["font-size", fs], "attr.font-size");
    this.children.update();
    this.call("onWidth");
    this.call("onHeight");
    return this;
}

function fontWeight(weight) {
    if (typeof(weight) === "undefined")
        return this.get("fontWeight");
    this.set("fontWeight", weight);
    Basic.prop.call(this, "attr", ["font-weight", weight], "attr.font-weight");
    return this;
}

function fontFamily(ff) {
    if (typeof(ff) === "undefined")
        return this.get("fontFamily");
    this.set("fontFamily", ff);
    Basic.prop.call(this, "attr", ["font-family", ff], "attr.font-family");
    this.set("width", fs2width(this.text(), this.fontFamily(), this.fontSize()));
    this.set("height", fs2height(this.text(), this.fontFamily(), this.fontSize()));
    this.children.update();
    this.call("onWidth");
    this.call("onHeight");
    return this;
}

function nw_resize(e) {
    let x = this.x();
    let y = this.y();
    let width = this.width();
    let dx = e.dx;
    let dy = e.dx * this.height() / this.width();
    if ((this.width() - dx >= MINW &&
        this.height() - dy >= MINH) || dx < 0)
        this.x(x + dx)
            .y(y + dy)
            .width(width - dx);
}

function ne_resize(e) {
    let y = this.y();
    let width = this.width();
    let dx = e.dx;
    let dy = -e.dx * this.height() / this.width();
    if ((this.width() + dx >= MINW &&
        this.height() - dy >= MINH) || dx > 0)
        this.y(y + dy)
            .width(width + dx);
}

function sw_resize(e) {
    let x = this.x();
    let width = this.width();
    if (this.width() - e.dx >= MINW || e.dx < 0)
        this.x(x + e.dx)
            .width(width - e.dx);
}

function fs2width(text, family, fs) {
    setText(helper, text);
    helper.attr("font-family", family);
    helper.attr("font-size", fs);
    let box = helper.node().getBBox();
    return box.width;
}

function fs2height(text, family, fs) {
    setText(helper, text);
    helper.attr("font-family", family);
    helper.attr("font-size", fs);
    let box = helper.node().getBBox();
    return box.height;
}

function width2fs(text, family, width) {
    setText(helper, text);
    helper.attr("font-family", family);
    helper.attr("font-size", 20);
    let box = helper.node().getBBox();
    return width / box.width * 20;
}

function height2fs(text, family, height) {
    setText(helper, text);
    helper.attr("font-family", family);
    helper.attr("font-size", 20);
    let box = helper.node().getBBox();
    return height / box.height * 20;
}