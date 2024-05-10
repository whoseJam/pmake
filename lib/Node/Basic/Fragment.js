import { Action } from "../../Animate/Action";
import { Interp } from "../../Animate/Interp";
import { SDNode } from "../Node";
import { d3ToNake } from "../../Utility/Tool";

let helper;

export function initFragment(svg) {
    helper = svg.append("g").attr("opacity", 0);
    helper = d3ToNake(helper);
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

export class Fragment extends SDNode {
    constructor(node, innerSVG="") {
        super(node);
        this.g().attr("type", "Fragment");
        this._.x = this._.bx = 0;
        this._.y = this._.by = 0;
        this._.width = this._.bwidth = 0;
        this._.height = this._.bheight = 0;
        this._.sx = this._.sy = 1;
        this._.dx = this._.dy = 0;
        this._.nake = d3ToNake(this._.group);
        this._.fragment = innerSVG;
        if (innerSVG) this._.nake.innerHTML = innerSVG;
    }

    fragment(innerSVG) {
        if (innerSVG === undefined) return this._.fragment;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.fragment, innerSVG,
            Interp.htmlInterp(this._.nake),
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
        this.dirty();
        return this;
    }

    update() {
        this.preUpdate();
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
        this.postUpdate();
        return this;
    }
}