import { equal } from "../../Utility/Math";
import { timeout } from "d3";
import * as Common from "../Common";
import { SnapHelper } from "../../Utility/SnapHelper";
import { Manager } from "../../Animate/Manager";

export function AbsBasic(self) {
    self.inRange = inRange;
    
    self.fill = fill;
    self.fillOpacity = fillOpacity;

    self.stroke = stroke;
    self.strokeOpacity = strokeOpacity;
    self.strokeWidth = strokeWidth;
    self.strokeDashOffset = strokeDashOffset;
    self.strokeDashArray = strokeDashArray;
    
    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
    self.basic = basic;
    self.remove = remove;
    self.color = color;
    self.opacity = opacity;
    self.clickable = clickable;
    self.update = update;
    self.animate = Manager(self);
    
    return self;
}

function inRange(vec) {
    let minX = this.x(), maxX = this.mx();
    let minY = this.y(), maxY = this.my();
    return minX <= vec[0] && vec[0] <= maxX && 
           minY <= vec[1] && vec[1] <= maxY;
}

function fill(color) {
    if (color === undefined)
        return this._.fill;
    this._.fill = color;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "fill",
            value: color
        })
    );
    return this;
}

function fillOpacity(opacity) {
    if (opacity === undefined)
        return this._.fillOpacity;
    this._.fillOpacity = opacity;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "fill-opacity",
            value: opacity
        })
    );
    return this;
}

function stroke(color) {
    if (color === undefined)
        return this._.stroke;
    this._.stroke = color;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "stroke",
            value: color
        })
    );
    return this;
}

function strokeOpacity(opacity) {
    if (opacity === undefined)
        return this._.strokeOpacity;
    this._.strokeOpacity = opacity;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "stroke-opacity",
            value: opacity
        })
    );
    return this;
}

function strokeWidth(width) {
    if (width === undefined)
        return this._.strokeWidth;
    this._.strokeWidth = width;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "stroke-width",
            value: width
        })
    );
    return this;
}

function strokeDashOffset(offset) {
    if (offset === undefined)
        return this._.strokeDashOffset;
    this._.strokeDashOffset = offset;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "stroke-dashoffset",
            value: offset
        })
    );
    return this;
}

function strokeDashArray(array) {
    if (array === undefined)
        return this._.strokeDashArray;
    this._.strokeDashArray = array;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "stroke-dasharray",
            value: array
        })
    );
    return this;
}

function x(x) {
    let ox = this.get("x");
    if (x === undefined)
        return ox;
    if (equal(x, ox)) return this;
    this.dirty();
    this._.x = x;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "x",
            value: x
        })
    );
    this.children.update();
    this.call("onX");
    return this;
}

function y(y) {
    let oy = this.get("y");
    if (y === undefined)
        return oy;
    if (equal(y, oy)) return this;
    this.dirty();
    this._.y = y;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "y",
            value: y
        })
    );
    this.children.update();
    this.call("onY");
    return this;
}

function width(width) {
    let ow = this.get("width");
    if (width === undefined)
        return ow;
    if (equal(width, ow)) return this;
    this.dirty();
    this._.width = width;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "width",
            value: width
        })
    );
    this.children.update();
    this.call("onWidth");
    return this;
}

function height(height) {
    let oh = this.get("height");
    if (height === undefined)
        return oh;
    if (equal(height, oh)) return this;
    this.dirty();
    this._.height = height;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "height",
            value: height
        })
    );
    this.children.update();
    this.call("onHeight");
    return this;
}

function basic() {
    return this._.d3;
}

function remove() {
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

function color(color) {
    if (typeof(color) === "string") {
        if (this.fill !== undefined) this.fill(color);
        else this.stroke(color);
    } else if (typeof(color) === "object") {
        this.fill(color.main);
        this.stroke(color.border);
    } else throw new Error("color is illegal");
    return this;
}

function opacity(opacity) {
    if (typeof(opacity) === "undefined")
        return this.get("opacity");
    this.set("opacity", opacity);
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "opacity",
            value: opacity
        })
    );
    Common.opacity.call(this, opacity);
    return this;
}

function clickable(flag) {
    let d3 = this._.d3;
    d3.style("pointer-events", flag ? "auto" : "none");
    return this;
}

function update() {
    this.children.update();
}