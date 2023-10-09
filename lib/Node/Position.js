import { equal } from "../Utility/Math";
import { SnapHelper } from "../Utility/SnapHelper";

export function Position(self) {
    self.set("x", 0);
    self.set("y", 0);
    self.set("width", 0);
    self.set("height", 0);
    self.set("min_width", null);
    self.set("min_height", null);
    self.set("max_width", null);
    self.set("max_height", null);

    self.x = x;
    self.y = y;
    self.cx = cx;
    self.cy = cy;
    self.dx = dx;
    self.dy = dy;
    self.mx = mx;
    self.my = my;
    self.width = width;
    self.height = height;
    self.min_width = min_width;
    self.min_height = min_height;
    self.max_width = max_width;
    self.max_height = max_height;

    return self;
}

function x(x) {
    let ox = this.get("x");
    if (x === undefined)
        return ox;
    if (equal(x, ox)) return this;
    this.dirty();
    this.set("x", x);
    if (this.isDirty) this.update();
    else {
        let group = Snap(this._.group);
        let matrix = group.matrix.clone();
        matrix.add(new Snap.Matrix().translate(x - ox, 0));
        let dly = this.delay(), dur = this.duration();
        if (this.isAnimating()) SnapHelper.animate(group, "transform", matrix, dly, dly + dur);
        else SnapHelper.attr(group, "transform", matrix, dly, dly + dur);
    }
    this.call("on_x");
    return this;
}

function y(y) {
    let oy = this.get("y");
    if (y === undefined)
        return oy;
    if (equal(y, oy)) return this;
    this.dirty();
    this.set("y", y);
    if (this.isDirty) this.update();
    else {
        let group = Snap(this._.group);
        let matrix = group.matrix.clone();
        matrix.add(new Snap.Matrix().translate(0, y - oy));
        let dly = this.delay(), dur = this.duration();
        if (this.isAnimating()) SnapHelper.animate(group, "transform", matrix, dly, dly + dur);
        else SnapHelper.attr(group, "transform", matrix, dly, dly + dur);
    }
    this.call("on_y");
    return this;
}

function width(width) {
    let ow = this.get("width");
    if (width === undefined)
        return ow;
    let min_width = this.get("min_width");
    let max_width = this.get("max_width");
    if (typeof(min_width) === "number" &&
        typeof(max_width) === "number" &&
        min_width > max_width) throw new Error("min width > max width");
    if (typeof(min_width) === "number" && min_width !== NaN)
        width = Math.max(width, min_width);
    if (typeof(max_width) === "number" && max_width !== NaN)
        width = Math.min(width, max_width);
    if (equal(width, ow)) return this;
    this.extWidth(width);
    this.set("width", width);
    this.call("on_width");
    this.update();
    return this;
}

function height(height) {
    let oh = this.get("height");
    if (typeof(height) === "undefined")
        return oh;
    let min_height = this.get("min_height");
    let max_height = this.get("max_height");
    if (typeof(min_height) === "number" &&
        typeof(max_height) === "number" &&
        min_height > max_height) throw new Error("min height > max height");
    if (typeof(min_height) === "number" && min_height !== NaN)
        height = Math.max(height, min_height);
    if (typeof(max_height) === "number" && max_height !== NaN)
        height = Math.min(height, max_height);
    if (equal(height, oh)) return this;
    this.extHeight(height);
    this.set("height", height);
    this.call("on_height");
    this.update();
    return this;;
}

function min_width(minw) {
    let owm = this.get("min_width");
    if (typeof(minw) === "undefined")
        return owm;
    this.set("min_width", minw, true);
    if (this.width() < minw) this.width(minw);
    return this;
}

function min_height(minh) {
    let ohm = this.get("min_height");
    if (typeof(minh) === "undefined")
        return ohm;
    this.set("min_height", minh, true);
    if (this.height() < minh) this.height(minh);
    return this;
}

function max_width(maxw) {
    let owm = this.get("max_width");
    if (typeof(maxw) === "undefined")
        return owm;
    this.set("max_width", maxw, true);
    if (this.width() > maxw) this.width(maxw);
    return this;
}

function max_height(maxh) {
    let ohm = this.get("max_height");
    if (typeof(ohm) === "undefined")
        return ohm;
    this.set("max_height", maxh, true);
    if (this.height() > maxh) this.height(maxh);
    return this;
}

function cx(cx) {
    if (cx === undefined)
        return this.x() + this.width() / 2;
    this.x(this.x() + cx - this.cx());
    return this;
}

function cy(cy) {
    if (cy === undefined)
        return this.y() + this.height() / 2;
    this.y(this.y() + cy - this.cy());
    return this;
}

function dx(d) {
    this.x(this.x() + d);
    return this;
}

function dy(d) {
    this.y(this.y() + d);
    return this;
}

function mx(mx) {
    if (mx === undefined)
        return this.x() + this.width();
    this.x(this.x() + mx - this.mx());
    return this;
}

function my(my) {
    if (my === undefined)
        return this.y() + this.height();
    this.y(this.y() + my - this.my());
    return this;
}