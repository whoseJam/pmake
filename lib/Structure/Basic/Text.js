import * as Basic from "./Basic";
import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { Traiter } from "../../Utility/TypeTrait";
import { Color } from "../../Utility/Color";
import { equal } from "../../Utility/Math";
import { timeout } from "d3";
import { AbsBasic } from "./Basic";
import { D3Helper } from "../../Utility/D3Helper";
import { SnapHelper } from "../../Utility/SnapHelper";

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
    if (conf.hsj !== undefined) {
        mode = conf.mode ? conf.mode : mode;
        svg = conf.svg;
    }

    let self = {};
    self = Node(self, svg, "Text");
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
    self.set("d3", 
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
    self._.basic = D3Helper.element(self._.d3);
    self._.snap = Snap(self._.basic);
    self = AbsBasic(self);
    
    self.width = width;
    self.height = height;
    self.text = text;
    self.fontSize = fontSize;
    self.fontWeight = fontWeight;
    self.fontFamily = fontFamily;
    
    if (mode !== "easy") {
        self = Interact(self);
        self.nw_resize = nw_resize;
        self.ne_resize = ne_resize;
        self.sw_resize = sw_resize;
    }

    self.clickable(false);

    self.text(self.get("text"));

    return self;
}

function width(width) {
    let ow = this._.width;
    if (width === undefined) return ow;
    if (equal(width, ow)) return this;
    this.fontSize(width2fs(
        this.text(), 
        this.fontFamily(), 
        width));
    return this;
}

function height(height) {
    let oh = this._.height;
    if (height === undefined) return oh;
    if (equal(height, oh)) return this;
    this.fontSize(height2fs(
        this.text(),
        this.fontFamily(),
        height));
    return this;
}

function text(text) {
    if (text === undefined)
        return this._.text;
    this._.text = String(text);
    text = parseText(text);
    let d3 = this._.d3;
    if (this.delay() + this.duration() >= 100) {
        timeout(() => {
            setText(d3, text);
        }, this.delay() + this.duration());
    } else setText(d3, text);
    this.set("width", fs2width(this.text(), this.fontFamily(), this.fontSize()));
    this.set("height", fs2height(this.text(), this.fontFamily(), this.fontSize()));
    this.children.update();
    this.call("onX"); this.call("onWidth");
    this.call("onY"); this.call("onHeight");
    return this;
}

function fontSize(fs) {
    let ofs = this.get("fontSize");
    if (fs === undefined) return ofs;
    if (equal(fs, ofs)) return this;
    if (!Traiter.isValidNumber(fs)) return this;
    this.dirty();
    this.set("fontSize", fs);
    this.set("width", fs2width(this.text(), this.fontFamily(), this.fontSize()));
    this.set("height", fs2height(this.text(), this.fontFamily(), this.fontSize()));
    this.animate.launch(
        D3Helper.action({
            elem: this._.d3,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "font-size",
            value: fs
        })
    );
    this.children.update();
    this.call("onWidth");
    this.call("onHeight");
    return this;
}

function fontWeight(weight) {
    if (typeof(weight) === "undefined")
        return this.get("fontWeight");
    this.set("fontWeight", weight);
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "font-weight",
            value: weight
        })
    );
    return this;
}

function fontFamily(ff) {
    if (typeof(ff) === "undefined")
        return this.get("fontFamily");
    this.set("fontFamily", ff);
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "font-family",
            value: ff
        })
    );
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