import { Action } from "@/Animate/Action";
import { BasicBase } from "@/Node/Basic/BasicBase";
import { D3Layer } from "@/Node/D3Layer";
import { d3ToNake } from "@/Utility/Tool";
import { equal } from "@/Utility/Math";
import { Interp } from "@/Animate/Interp";
import { SDNode } from "@/Node/Node";

/**
 * @class Fragment
 * @description <g>元素的代表类
 */
export class Fragment extends BasicBase {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     * @param {string} html 
     */
    constructor(node, html = "") {
        super(node, "g");
        this.g().type("Fragment");
        this._.x = 0;
        this._.y = 0;
        this._.width = 0;
        this._.height = 0;
        this._.html = html;
        this._.transform = getMatrix(0, 0, 0, 0, 0, 0);
        if (html) {
            this._.nake.innerHTML = html;
            const box = getBox(html);
            this._.snapshot = box;
            this._.transform = getMatrix(1, 1, 1, 1, box.x, box,y);
        }
    }

    /**
     * @overload
     * @param {number} x 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    x(x) {
        this.dirtyCheck("m");
        if (x === undefined) return this._.x;
        if (equal(x, this._.x)) return this;
        this._.x = x;
        this.dirty(this, "U");
        return this;
    }

    /**
     * @overload
     * @param {number} y 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    y(y) {
        this.dirtyCheck("m");
        if (y === undefined) return this._.y;
        if (equal(y, this._.y)) return this;
        this._.y = y;
        this.dirty(this, "U");
        return this;
    }

    /**
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width(width) {
        this.dirtyCheck("m");
        if (width === undefined) return this._.width;
        if (equal(width, this._.width)) return this;
        this._.width = width;
        this.dirty(this, "U");
        return this;
    }

    /**
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height(height) {
        this.dirtyCheck("m");
        if (height === undefined) return this._.height;
        if (equal(height, this._.height)) return this;
        this._.height = height;
        this.dirty(this, "U");
        return this;
    }

    /**
     * @overload
     * @param {string} html 
     * @returns {this}
     * @overload
     * @returns {string}
     */
    fragment(html) {
        if (html === undefined) return this._.html;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.html, html,
            Interp.innerHTMLInterp(this._.nake),
            this, "fragment"
        );
        this._.html = html;
        const box = getBox(html);
        this._.x = box.x;
        this._.y = box.y;
        this._.width = box.width;
        this._.height= box.height;
        this._.snapshot = box;
        this.dirty(this, "R");
        return this;
    }

    update() {
        this.preUpdate();
        if (this._.snapshot) {
            const sx = this._.width / this._.snapshot.width;
            const sy = this._.height / this._.snapshot.height;
            const dx = this._.x - this._.snapshot.x;
            const dy = this._.y - this._.snapshot.y;
            const transform = getMatrix(sx, sy, dx, dy, this._.snapshot.x, this._.snapshot.y);
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this._.transform, transform,
                Interp.matrixInterp(this._.nake, "transform"),
                this, "transform"
            );
            this._.transform = transform;
        }
        this.postUpdate();
        return this;
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