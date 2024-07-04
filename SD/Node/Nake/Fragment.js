import { Interp } from "@/Animate/Interp";
import { naiveGetterAndSetter } from "../Common";
import { BaseNake } from "./BaseNake";
import { d3ToNake } from "@/Utility/Tool";
import { Action } from "@/Animate/Action";

export function Fragment(parent, html = "") {
    BaseNake.call(this, parent, "g");
    this.g().type("Fragment");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 0);
    this.member.new("height", 0);
    this.member.new("html", "");
    this.member.new("transform", getMatrix(0, 0, 0, 0, 0, 0));
    this.member.new("snapshot", undefined);
    if (html) {
        this.fragment(html);
    }
}

Fragment.prototype = {
    ...BaseNake.prototype
};

Fragment.prototype.x        = naiveGetterAndSetter("x", "setByEqual");
Fragment.prototype.y        = naiveGetterAndSetter("y", "setByEqual");
Fragment.prototype.width    = naiveGetterAndSetter("width", "setByEqual");
Fragment.prototype.height   = naiveGetterAndSetter("height", "setByEqual");
Fragment.prototype.fragment = naiveGetterAndSetter("html", "set");
Fragment.prototype.updateList = [
    ...Fragment.prototype.updateList,
    update
];

function update() {
    if (this.member.hasChanged("html")) {
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this.member.oldValue("html"),
            this.member.get("html"),
            Interp.innerHTMLInterp(this._.nake),
            this, "fragment"
        );
        this.member.flush("html");
        const box = getBox(this.member.get("html"));
        this.member.setByEqual("x", box.x);
        this.member.setByEqual("y", box.y);
        this.member.setByEqual("width", box.width);
        this.member.setByEqual("height", box.height);
        this.member.set("snapshot", box);
        this.member.set("transform", getMatrix(1, 1, 1, 1, box.x, box.y));
        this.member.flush("x");
        this.member.flush("y");
        this.member.flush("width");
        this.member.flush("height");
        this.member.flush("transform");
    }
    if (this.member.get("snapshot") &&
        (this.member.hasChanged("x") ||
        this.member.hasChanged("y") || 
        this.member.hasChanged("width") ||
        this.member.hasChanged("height"))) {
        const snapshot = this.member.get("snapshot");
        const x = this.member.get("x");
        const y = this.member.get("y");
        const width = this.member.get("width");
        const height = this.member.get("height");
        const sx = width / snapshot.width;
        const sy = height / snapshot.height;
        const dx = x - snapshot.x;
        const dy = y - snapshot.y;
        const transform = getMatrix(sx, sy, dx, dy, snapshot.x, snapshot.y);
        console.log("transform = ", transform);
        this.member.set("transform", transform);
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this.member.oldValue("transform"), 
            this.member.get("transform"),
            Interp.matrixInterp(this._.nake, "transform"),
            this, "transform"
        );
        this.member.flush("x");
        this.member.flush("y");
        this.member.flush("width");
        this.member.flush("height");
        this.member.flush("transform");
    }
}

let fragmentHelper;
export function initFragment(svg) {
    fragmentHelper = d3ToNake(svg.append("g"));
    fragmentHelper.setAttribute("opacity", 0);
}

/**
 * @param {string} html 
 * @returns {{x: number, y: number, width: number, height: number}}
 */
function getBox(html) {
    fragmentHelper.innerHTML = html;
    return fragmentHelper.getBBox();
}

/**
 * @param {number} sx 
 * @param {number} sy 
 * @param {number} dx 
 * @param {number} dy 
 * @param {number} bx 
 * @param {number} by 
 * @returns {{
 *  sx: number,
 *  sy: number,
 *  dx: number,
 *  dy: number,
 *  bx: number,
 *  by: number
 * }}
 */
function getMatrix(sx, sy, dx, dy, bx, by) {
    return {
        a: sx, b: 0, c: 0, d: sy,
        e: sx * dx + (1 - sx) * (bx + dx),
        f: sy * dy + (1 - sy) * (by + dy)
    };
}