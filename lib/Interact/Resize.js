import { Circle } from "../Structure/Basic/Circle";
import { Rect } from "../Structure/Basic/Rect";
import * as d3 from "d3";

const R = 5;
const LONG = 10;
const SHORT = 3;
export const MINW = 15;
export const MINH = 15;

let nw_resize;
let n_resize;
let ne_resize;
let w_resize;
let e_resize;
let sw_resize;
let s_resize;
let se_resize;

function nw_reisze_func(e) {
    if (typeof(this.nw_resize) === "function") {
        this.nw_resize(e);
        return;
    }
    let mx = this.mx();
    let my = this.my();
    let width = this.width();
    let height = this.height();
    if (this.height() - e.dy >= MINH || e.dy < 0)
        this.height(height - e.dy)
            .mx(mx).my(my);
    if (this.width() - e.dx >= MINW || e.dx < 0)
        this.width(width - e.dx)
            .mx(mx).my(my);
}

function n_resize_func(e) {
    if (typeof(this.n_resize) === "function") {
        this.n_resize(e);
        return;
    }
    let my = this.my();
    let height = this.height();
    if (this.height() - e.dy >= MINH || e.dy < 0)
        this.height(height - e.dy)
            .my(my);
}

function ne_resize_func(e) {
    if (typeof(this.ne_resize) === "function") {
        this.ne_resize(e);
        return;
    }
    let x = this.x();
    let my = this.my()
    let width = this.width();
    let height = this.height();
    if (this.height() - e.dy >= MINH || e.dy < 0)
        this.height(height - e.dy)
            .x(x).my(my);
    if (this.width() + e.dx >= MINW || e.dx > 0)
        this.width(width + e.dx)
            .x(x).my(my);
}

function w_resize_func(e) {
    if (typeof(this.w_resize) === "function") {
        this.w_resize(e);
        return;
    }
    let mx = this.mx();
    let width = this.width();
    if (this.width() - e.dx >= MINW || e.dy < 0)
        this.width(width - e.dx)
            .mx(mx);
}

function e_resize_func(e) {
    if (typeof(this.e_resize) === "function") {
        this.e_resize(e);
        return;
    }
    let width = this.width();
    if (this.width() + e.dx >= MINW || e.dx > 0)
        this.width(width + e.dx);
}

function sw_resize_func(e) {
    if (typeof(this.sw_resize) === "function") {
        this.sw_resize(e);
        return;
    }
    let mx = this.mx();
    let y = this.y();
    let width = this.width();
    let height = this.height();
    if (this.width() - e.dx >= MINW || e.dx < 0)
        this.width(width - e.dx)
            .mx(mx).y(y);
    if (this.height() + e.dy >= MINH || e.dy > 0)
        this.height(height + e.dy)
            .mx(mx).y(y);
}

function s_resize_func(e) {
    if (typeof(this.s_resize) === "function") {
        this.s_resize(e);
        return;
    }
    let height = this.height();
    if (this.height() + e.dy >= MINH || e.dy > 0)
        this.height(height + e.dy);
}

function se_resize_func(e) {
    if (typeof(this.se_resize) === "function") {
        this.se_resize(e);
        return;
    }
    let width = this.width();
    let height = this.height();
    if (this.width() + e.dx >= MINW || e.dx > 0)
        this.width(width + e.dx);
    if (this.height() + e.dy >= MINH || e.dy > 0)
        this.height(height + e.dy);
}

function init(svg) {
    nw_resize = Circle({svg: svg, mode: "easy", hsj: true}).r(R);
    n_resize = Rect({svg: svg, mode: "easy", hsj: true}).width(LONG).height(SHORT);
    ne_resize = Circle({svg: svg, mode: "easy", hsj: true}).r(R);
    w_resize = Rect({svg: svg, mode: "easy", hsj: true}).width(SHORT).height(LONG);
    e_resize = Rect({svg: svg, mode: "easy", hsj: true}).width(SHORT).height(LONG);
    sw_resize = Circle({svg: svg, mode: "easy", hsj: true}).r(R);
    s_resize = Rect({svg: svg, mode: "easy", hsj: true}).width(LONG).height(SHORT);
    se_resize = Circle({svg: svg, mode: "easy", hsj: true}).r(R);

    nw_resize.clickable(true);
    n_resize.clickable(true);
    ne_resize.clickable(true);
    w_resize.clickable(true);
    e_resize.clickable(true);
    sw_resize.clickable(true);
    s_resize.clickable(true);
    se_resize.clickable(true);

    nw_resize.g().style("cursor", "nw-resize");
    n_resize.g().style("cursor", "n-resize");
    ne_resize.g().style("cursor", "ne-resize");
    w_resize.g().style("cursor", "w-resize");
    e_resize.g().style("cursor", "e-resize");
    sw_resize.g().style("cursor", "sw-resize");
    s_resize.g().style("cursor", "s-resize");
    se_resize.g().style("cursor", "se-resize");

    function fresh() { window.__frame__++; }

    nw_resize.basic().on("mousedown", fresh);
    n_resize.basic().on("mousedown", fresh);
    ne_resize.basic().on("mousedown", fresh);
    w_resize.basic().on("mousedown", fresh);
    e_resize.basic().on("mousedown", fresh);
    sw_resize.basic().on("mousedown", fresh);
    s_resize.basic().on("mousedown", fresh);
    se_resize.basic().on("mousedown", fresh);

    nw_resize.basic().call(d3.drag().on("drag", nw_reisze_func.bind(this)));
    n_resize .basic().call(d3.drag().on("drag", n_resize_func.bind(this)));
    ne_resize.basic().call(d3.drag().on("drag", ne_resize_func.bind(this)));
    w_resize .basic().call(d3.drag().on("drag", w_resize_func.bind(this)));
    e_resize .basic().call(d3.drag().on("drag", e_resize_func.bind(this)));
    sw_resize.basic().call(d3.drag().on("drag", sw_resize_func.bind(this)));
    s_resize .basic().call(d3.drag().on("drag", s_resize_func.bind(this)));
    se_resize.basic().call(d3.drag().on("drag", se_resize_func.bind(this)));
}

function destroy() {
    nw_resize.remove();
    n_resize.remove();
    ne_resize.remove();
    w_resize.remove();
    e_resize.remove();
    sw_resize.remove();
    s_resize.remove();
    se_resize.remove();
}

export function Resizeable(self) {
    self.set("resizeable", false);
    
    function resizeable(x) {
        if (typeof(x) === "undefined")
            return this.get("resizeable");
        this.set("resizeable", x);
        this.overlay(x ? 1 : -1);
        if (x && this.isActivated())
            this.call("onActivate");
        return this;
    }

    self.listen("onActivate", onActivate);
    self.listen("onDeactivate", onDeactivate);
    self.listen("onX", onAnyPositionChange);
    self.listen("onY", onAnyPositionChange);
    self.listen("onWidth", onAnyPositionChange);
    self.listen("onHeight", onAnyPositionChange);

    self.resizeable = resizeable;

    return self;
}

function update_resize() {
    let overlay = this.get("overlay");
    nw_resize.cx(overlay.x()).cy(overlay.y());
    n_resize.cx(overlay.cx()).cy(overlay.y());
    ne_resize.cx(overlay.mx()).cy(overlay.y());
    w_resize.cx(overlay.x()).cy(overlay.cy());
    e_resize.cx(overlay.mx()).cy(overlay.cy());
    sw_resize.cx(overlay.x()).cy(overlay.my());
    s_resize.cx(overlay.cx()).cy(overlay.my());
    se_resize.cx(overlay.mx()).cy(overlay.my());
}

function onActivate() {
    if (!this.resizeable()) return;
    let overlay = this.get("overlay");
    init.call(this, overlay);
    update_resize.call(this);
}

function onDeactivate() {
    if (!this.resizeable()) return;
    destroy.call(this);
}

function onAnyPositionChange() {
    if (!this.resizeable()) return;
    if (this.isActivated())
        update_resize.call(this);
}