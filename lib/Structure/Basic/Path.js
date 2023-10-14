import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { SnapHelper } from "../../Utility/SnapHelper";
import { D3Helper } from "../../Utility/D3Helper";
import { equal } from "../../Utility/Math";
import * as Basic from "./Basic";
import { AbsBasic } from "./Basic";

export function Path(node) {
    let self = {};
    self = Node(self, node);
    self = AbsBasic(self);
    self = Interact(self);

    self._.d3 = self._.group.append("path");
    self._.snap = Snap(D3Helper.element(self._.d3));
    self._.pathStr = "";
    
    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
    self.d = d;
    self.opacity = opacity;

    return self;
}

function x(x) {
    let ox = this._.x;
    if (x === undefined)
        return ox;
    if (equal(x, ox)) return this;
    let dx = x - ox;
    throw new Error;
    return this;
}

function y(y) {
    let oy = this._.y;
    if (y === undefined)
        return oy;
    if (equal(y, oy)) return this;
    let dy = y - oy;
    throw new Error;
    return this;
}

function width(width) {
    let owidth = this._.width;
    if (width === undefined)
        return owidth;
    if (equal(width, owidth)) return this;
    throw new Error;
    return this;
}

function height(height) {
    let oheight = this._.height;
    if (height === undefined)
        return oheight;
    if (equal(height, oheight)) return this;
    throw new Error;
    return this;
}

function d(pathStr) {
    if (pathStr === undefined)
        return this._.d;
    this._.d = pathStr;
    let dly = this.delay(), dur = this.duration();
    if (this.isAnimating()) SnapHelper.animate(this._.snap, "d", pathStr, dly, dly + dur);
    else SnapHelper.attr(this._.snap, "d", pathStr, dly, dly + dur);
    return this;
}

function opacity(opacity) {
    if (opacity === undefined)
        return this._.opacity;
    this._.opacity = opacity;
    if (this.isAnimating()) D3Helper.animate(this._.d3, "opacity", opacity);
    else D3Helper.attr(this._.d3, "opacity", opacity);
    // Common.opacity.call(this, opacity);
    return this;
}