import { equal } from "../../Utility/Math";
import { timeout } from "d3";
import * as Common from "../Common";

export function AbsBasic(self) {
    self.strokeDashOffset = strokeDashOffset;
    self.strokeDashArray = strokeDashArray;
    return self;
}

function getSchedules() {
    let handle = this.get("handle");
    let group = handle._groups[0];
    let node = group[0];
    if (typeof(node.__transition) === "undefined") return {};
    let schedules = node.__transition;
    return schedules;
}

function processByTrans(name, id) {
    if (typeof(name) === "undefined") return;
    let schedules = getSchedules.call(this);
    let me = schedules[id];
    if (!me) return;
    for (let i in schedules) {
        if (i >= id) continue;
        let o = schedules[i];
        o.removeTween(name);
    }
}

function processByHandle(name) {
    if (typeof(name) === "undefined") return;
    let schedules = getSchedules.call(this);
    for (let i in schedules) {
        let o = schedules[i];
        o.removeTween(name);
    }
}

export function transition(start, end) {
    let trans = this.get("handle")
                    .transition()
                    .duration(end - start)    
                    .delay(start);
    trans.ended = false;
    trans.frame = window.__frame__;
    trans.start_stamp = start;
    trans.start_queue = [];
    trans.end_stamp = end;
    trans.end_queue = [];
    trans.on("start", () => {
        trans.start_queue.forEach((func) => { func(); }); });
    trans.on("end", () => { 
        trans.ended = true;
        trans.end_queue.forEach((func) => { func(); }); });
    trans.on_start = (func) => {
        trans.start_queue.push(func); return trans; };
    trans.on_end = (func) => { trans.end_queue.push(func); return trans; };
    return trans;
}

export function prop(funcname, args, name) {
    let dly = this.delay();
    let dur = this.duration();
    let isa = this.isAnimating();
    let trans = this.get("transition");
    if (isa) {
        if (trans && 
            trans.start_stamp === dly &&
            trans.end_stamp === dly + dur && 
            trans.frame === window.__frame__ &&
            trans.ended === false) {
            trans[funcname].apply(trans, args);
            trans.on_start(() => {
                processByTrans.call(this, name);
            });
        } else {
            trans = this.transition(dly, dly + dur);
            trans[funcname].apply(trans, args);
            trans.on_start(() => {
                processByTrans.call(this, name);
            });
            this.set("transition", trans);
        }
        return;
    }

    let This = this;
    let handle = this.get("handle");
    if (trans && 
        trans.end_stamp === dly && 
        trans.frame === window.__frame__ && 
        trans.ended == false) {
        trans.on_end(() => {
            handle[funcname].apply(handle, args);
            processByHandle.call(This, name);
        });
    } else if (dly > 0) {
        trans = this.transition(dly, dly + dur);
        trans.on_end(() => { 
            handle[funcname].apply(handle, args);
            processByHandle.call(This, name); 
        });
        this.set("transition", trans);
    } else {
        handle[funcname].apply(handle, args);
        processByHandle.call(this, name);
    }
}

export function inRange(vec) {
    let minX = this.x(), maxX = this.mx();
    let minY = this.y(), maxY = this.my();
    return minX <= vec[0] && vec[0] <= maxX && 
           minY <= vec[1] && vec[1] <= maxY;
}

export function fill(color) {
    if (typeof(color) === "undefined")
        return this.get("fill");
    this.set("fill", color);
    prop.call(this, "attr", ["fill", color], "attr.fill");
    return this;
}

export function fillOpacity(opacity) {
    if (typeof(opacity) === "undefined")
        return this.get("fillOpacity");
    this.set("fillOpacity", opacity);
    prop.call(this, "attr", ["fill-opacity", opacity], "attr.fill-opacity");
    return this;
}

export function stroke(color) {
    if (typeof(color) === "undefined")
        return this.get("stroke");
    this.set("stroke", color);
    prop.call(this, "attr", ["stroke", color], "attr.stroke");
    return this;
}

export function strokeOpacity(opacity) {
    if (typeof(opacity) === "undefined")
        return this.get("strokeOpacity");
    this.set("strokeOpacity", opacity);
    prop.call(this, "attr", ["stroke-opacity", opacity], "attr.stroke-opacity");
    return this;
}

export function strokeWidth(width) {
    if (typeof(width) === "undefined")
        return this.get("strokeWidth");
    this.set("strokeWidth", width);
    prop.call(this, "attr", ["stroke-width", width], "attr.stroke-width");
    return this;
}

function strokeDashOffset(offset) {
    if (offset === undefined)
        return this._.strokeDashOffset;
    this._.strokeDashOffset = offset;
    prop.call(this, "attr", ["stroke-dashoffset", offset], "attr.stroke-dashoffset");
    return this;
}

function strokeDashArray(array) {
    if (array === undefined)
        return this._.strokeDashArray;
    this._.strokeDashArray = array;
    prop.call(this, "attr", ["stroke-dasharray", array], "attr.stroke-dasharray");
    return this;
}

export function x(x) {
    let ox = this.get("x");
    if (typeof(x) === "undefined")
        return ox;
    if (equal(x, ox)) return this;
    this.dirty();
    this.set("x", x);
    prop.call(this, "attr", ["x", x], "attr.x");
    this.children.update();
    this.call("onX");
    return this;
}

export function y(y) {
    let oy = this.get("y");
    if (typeof(y) === "undefined")
        return oy;
    if (equal(y, oy)) return this;
    this.dirty();
    this.set("y", y);
    prop.call(this, "attr", ["y", y], "attr.y");
    this.children.update();
    this.call("onY");
    return this;
}

export function width(width) {
    let ow = this.get("width");
    if (typeof(width) === "undefined")
        return ow;
    if (equal(width, ow)) return this;
    this.dirty();
    this.set("width", width);
    prop.call(this, "attr", ["width", width], "attr.width");
    this.children.update();
    this.call("onWidth");
    return this;
}

export function height(height) {
    let oh = this.get("height");
    if (typeof(height) === "undefined")
        return oh;
    if (equal(height, oh)) return this;
    this.dirty();
    this.set("height", height);
    prop.call(this, "attr", ["height", height], "attr.height");
    this.children.update();
    this.call("onHeight");
    return this;
}

export function basic() {
    return this.get("handle");
}

export function remove() {
    let This = this;
    let group = this.get("group");
    if (this.delay() + this.duration() >= 100) {
        timeout(() => {
            group.remove();
            timeout(() => {
                for (let key in This) 
                delete This[key];
            }, 1000);
        }, this.delay() + this.duration() - 100);
    } else {
        group.remove();
        for (let key in this)
            delete this[key];
    }
}

export function color(color) {
    if (typeof(color) === "string") {
        if (this.fill !== undefined) this.fill(color);
        else this.stroke(color);
    } else if (typeof(color) === "object") {
        this.fill(color.main);
        this.stroke(color.border);
    } else throw new Error("color is illegal");
    return this;
}

export function opacity(opacity) {
    if (typeof(opacity) === "undefined")
        return this.get("opacity");
    this.set("opacity", opacity);
    prop.call(this, "attr", ["opacity", opacity], "attr.opacity");
    Common.opacity.call(this, opacity);
    return this;
}

export function clickable(flag) {
    let handle = this.get("handle");
    handle.style("pointer-events", flag ? "auto" : "none");
    return this;
}

export function update() {
    this.children.update();
}