import { Node } from "../../Node/Node_";
import { Interact } from "../../Interact/Interact";
import { SnapHelper } from "../../Utility/SnapHelper";
import { D3Helper } from "../../Utility/D3Helper";
import { equal } from "../../Utility/Math";
import { AbsBasic } from "./Basic";
import { Color } from "../../Utility/Color";

let helper;
export function INIT_POLYLINE(svg) {
    helper = svg.append("polyline");
    helper.attr("stroke-opacity", 0);
    helper.attr("fill-opacity", 0);
}

export function Polyline(node) {
    let self = {};

    self = Node(self, node, "Polyline");
    self = AbsBasic(self);
    self = Interact(self);

    self._.d3 = self._.group.append("polyline");
    self._.snap = Snap(D3Helper.element(self._.d3));
    self._.points = [];

    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
    self.points = points;
    self.totalLength = totalLength;
    self.getPointAtLength = getPointAtLength;
    self.at = at;

    self.stroke(Color.black);
    self.strokeWidth(1);
    self.fill(Color.white);
    self.fillOpacity(0);

    return self;
}

function Points2Str(points) {
    let ans = "";
    for (let i = 0; i < points.length; i++) {
        ans = ans + points[i];
        if (i + 1 < points.length) ans = ans + ",";
    }
    return ans;
}

function x(x) {
    let ox = this._.x;
    if (x === undefined)
        return ox;
    if (equal(x, ox)) return this;
    this.dirty();
    this._.x = x;
    let dx = x - ox, points = this._.points;
    for (let i = 0; i < points.length; i += 2)
        points[i] += dx;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "points",
            value: Points2Str(points)
        })
    );
    this.children.update();
    this.call("onX");
    return this;
}

function y(y) {
    let oy = this._.y;
    if (y === undefined)
        return oy;
    if (equal(y, oy)) return this;
    this.dirty();
    this._.y = y;
    let dy = y - oy, points = this._.points;
    for (let i = 0; i < points.length; i += 2)
        points[i + 1] += dy;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "points",
            value: Points2Str(points)
        })
    );
    this.children.update();
    this.call("onY");
    return this;
}

function width(width) {
    let owidth = this._.width;
    if (width === undefined)
        return owidth;
    if (Math.abs(owidth) <= 1e-3) return this;
    this.dirty();
    this._.width = width;
    let points = this._.points;
    for (let i = 0; i < points.length; i += 2) {
        let dx = points[i] - this._.x;
        let nx = dx / owidth * width + this._.x;
        points[i] = nx;
    }
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "points",
            value: Points2Str(points)
        })
    );
    this.call("onWidth");
    return this;
}

function height(height) {
    let oheight = this._.height;
    if (height === undefined)
        return oheight;
    if (Math.abs(oheight) <= 1e-3) return this;
    this.dirty();
    this._.height = height;
    let points = this._.points;
    for (let i = 0; i < points.length; i += 2) {
        let dy = points[i + 1] - this._.y;
        let ny = dy / oheight * height + this._.y;
        points[i + 1] = ny;
    }
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "points",
            value: Points2Str(points)
        })
    );
    this.call("onHeight");
    return this;
}

export function points(points) {
    if (points === undefined)
        return this._.points;
    this._.points = points;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "points",
            value: Points2Str(points)
        })
    );
    let minX, maxX, minY, maxY;
    if (points.length === 0) {
        minX = maxX = minY = maxY = 0;
    } else {
        minX = maxX = points[0];
        minY = maxY = points[1];
        for (let i = 2; i < points.length; i += 2) {
            minX = Math.min(minX, points[i]);
            maxX = Math.max(maxX, points[i]);
            minY = Math.min(minY, points[i + 1]);
            maxY = Math.max(maxY, points[i + 1]);
        }
    }
    this._.x = minX; this.call("onX");
    this._.y = minY; this.call("onY");
    this._.width = maxX - minX; this.call("onWidth");
    this._.height = maxY - minY; this.call("onHeight");
    return this;
}

function totalLength() {
    helper.attr("points", Points2Str(this._.points));
    let elem = D3Helper.element(helper);
    return elem.getTotalLength();
}

function at(k) {
    k = Math.min(1, Math.max(0, k));
    helper.attr("points", Points2Str(this._.points));
    let elem = D3Helper.element(helper)
    let length = elem.getTotalLength() * k;
    let point = elem.getPointAtLength(length);
    return [point.x, point.y];
}

function getPointAtLength(length) {
    helper.attr("points", Points2Str(this._.points));
    let elem = D3Helper.element(helper)
    let point = elem.getPointAtLength(length);
    return [point.x, point.y];
}