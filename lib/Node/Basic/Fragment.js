import { Action } from "../../Animate/Action";
import { D3Helper } from "../../Utility/D3Helper";
import { Interp } from "../../Animate/Interp";
import { Node } from "../Node";
import { equal } from "../../Utility/Math";

let helper;

export function INIT_FRAGMENT(svg) {
    helper = svg.append("g").attr("opacity", 0);
    helper = D3Helper.element(helper);
}

function getBox(fragment) {
    helper.innerHTML = fragment;
    return helper.getBBox();
}

function getMatrix(sx, sy, dx, dy, bx, by) {
    return {
        a: sx, b: 0, c: 0, d: sy,
        e: sx*dx+(1-sx)*(bx+dx),
        f: sy*dy+(1-sy)*(by+dy)
    };
}

export class Fragment extends Node {
    constructor(node, innerSVG="") {
        super(node);
        this.g().attr("type", "Fragment");
        this._.x = this._.bx = 0;
        this._.y = this._.by = 0;
        this._.width = this._.bwidth = 0;
        this._.height = this._.bheight = 0;
        this._.sx = this._.sy = 1;
        this._.dx = this._.dy = 0;
        this._.basic = D3Helper.element(this._.group);
        this._.fragment = innerSVG;
        if (innerSVG) this._.basic.innerHTML = innerSVG;
    }

    fragment(innerSVG) {
        if (innerSVG === undefined) return this._.fragment;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.fragment, innerSVG,
            Interp.htmlInterp(this._.basic),
            this, "fragment"
        );
        this._.fragment = innerSVG;
        let box = getBox(innerSVG);
        this._.x = this._.bx = box.x;
        this._.y = this._.by = box.y;
        this._.width = this._.bwidth = box.width;
        this._.height = this._.bheight = box.height;
        this._.sx = this._.sy = 1;
        this._.dx = this._.dy = 0;
        let sx = this._.bwidth ? this._.width / this._.bwidth : 1;
        let sy = this._.bheight ? this._.height / this._.bheight : 1;
        let dx = this._.x - this._.bx;
        let dy = this._.y - this._.by;
        let from = getMatrix(this._.sx, this._.sy, this._.dx, this._.dy, this._.bx, this._.by);
        let to = getMatrix(sx, sy, dx, dy, this._.bx, this._.by);
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            from, to,
            Interp.matrixInterp(this._.group),
            this, "transform"
        );
        this._.sx = sx; this._.sy = sy;
        this._.dx = dx; this._.dy = dy;
        return this;
    }

    resize() {
        let sx = this._.bwidth ? this._.width / this._.bwidth : 1;
        let sy = this._.bheight ? this._.height / this._.bheight : 1;
        let dx = this._.x - this._.bx;
        let dy = this._.y - this._.by;
        let from = getMatrix(this._.sx, this._.sy, this._.dx, this._.dy, this._.bx, this._.by);
        let to = getMatrix(sx, sy, dx, dy, this._.bx, this._.by);
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            from, to,
            Interp.matrixInterp(this._.group),
            this, "transform"
        );
        this._.sx = sx; this._.sy = sy;
        this._.dx = dx; this._.dy = dy;
    }

    x(x) {
        let ox = this._.x;
        if (x === undefined) return ox;
        if (equal(x, ox)) return this;
        this._.x = x;
        this.resize();
        return this;
    }

    y(y) {
        let oy = this._.y;
        if (y === undefined) return oy;
        if (equal(y, oy)) return this;
        this._.y = y;
        this.resize();
        return this;
    }

    width(width) {
        let owidth = this._.width;
        if (width === undefined) return owidth;
        if (equal(width, owidth)) return this;
        this._.width = width;
        this.resize();
        return this;
    }

    height(height) {
        let oheight = this._.height;
        if (height === undefined) return oheight;
        if (equal(height, oheight)) return this;
        this._.height = height;
        this.resize();
        return this;
    }

    update() {
        this.children.update();
        return this;
    }
}