import { Action } from "../../Animate/Action";
import { d3ToNake } from "../../Utility/Tool";
import { equal } from "../../Utility/Math";
import { LinkBase } from "./LinkBase";
import { nakeToSnap } from "../../Utility/Tool";
import { SDNode } from "../Node";
import { snapAction } from "../../Utility/Tool";
import { D3Layer } from "../D3Layer";

export class Path extends LinkBase {
    /**
     * @constructor
     * @param {SDNode|D3Layer} node 
     */
    constructor(node) {
        super(node, "path");
        this.g().type("Path");
        this._.nake.setAttribute("d", "M 0, 0 L 0, 0");
        this._.d = "M 0, 0 L 0, 0";
    }

    /**
     * 获取线上的k分位点
     * @param {number} k
     * @returns {[number, number]}
     */
    at(k) {
        return getPointByRate(this._.d, k);
    }

    /**
     * 获取线上距离起点长度length的点
     * @param {number} length 
     * @returns {[number, number]}
     */
    getPointAtLength(length) {
        return getPointAtLength(this._.d, length);
    }

    /**
     * 获取线的总长
     * @returns {number}
     */
    totalLength() {
        return getTotalLength(this._.d);
    }

    /**
     * @overload
     * @param {number} x 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    x(x) {
        this.dirtyCheck();
        if (x === undefined) return this._.x;
        if (equal(x, this._.x)) return this;
        this.d(move(this._.d, x - this._.x, 0));
        this._.x = x;
        this.dirty(this, "R");
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
        this.dirtyCheck();
        if (y === undefined) return this._.y;
        if (equal(y, this._.y)) return this;
        this.d(move(this._.d, 0, y - this._.y));
        this._.y = y;
        this.dirty(this, "R");
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
        this.dirtyCheck();
        if (width === undefined) return this._.width;
        if (equal(width, this._.width)) return this;
        throw new Error("Not Implemented Yet");
    }
    
    /**
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height(height) {
        this.dirtyCheck();
        if (height === undefined) return this._.height;
        if (equal(height, this._.height)) return this;
        throw new Error("Not Implemented Yet");
    }

    /**
     * @overload
     * @param {string} d 
     * @returns {this}
     * @overload
     * @returns {string}
     */
    d(d) {
        this.dirtyCheck("m");
        if (d === undefined) return this._.d;
        const duration = this.duration();
        const snap = this._.snap;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.d, d,
            function(t) {
                if (t === 0) {
                    snapAction({
                        elem: snap,
                        start: 0,
                        end: duration,
                        key: "d",
                        value: this.to
                    });
                }
            },
            this, "d"
        );
        const box = pathToBox(this._.d = d);
        this._.x = box.x;
        this._.y = box.y;
        this._.width = box.width;
        this._.height = box.height;
        this.dirty(this, "R");
        return this;
    }
}

let pathHelper;
export function initPath(svg) {
    pathHelper = d3ToNake(svg.append("path"));
    pathHelper.setAttribute("stroke-opacity", 0);
    pathHelper.setAttribute("fill-opacity", 0);
}

/**
 * @param {string} d 
 * @returns {{x: number, y: number, width: number, height: number}}
 */
function pathToBox(d) {
    pathHelper.setAttribute("d", d);
    return pathHelper.getBBox();
}

/**
 * @param {string} d 
 * @param {number} length 
 * @returns {[number, number]}
 */
function getPointAtLength(d, length) {
    try {
        pathHelper.setAttribute("d", d);
        const point = pathHelper.getPointAtLength(length);
        return [point.x, point.y];
    } catch(e) {
        return [0, 0];
    }
}

/**
 * @param {string} d 
 * @param {number} k 
 * @returns {[number, number]}
 */
function getPointByRate(d, k) {
    try {
        pathHelper.setAttribute("d", d);
        const length = pathHelper.getTotalLength() * k;
        const point = pathHelper.getPointAtLength(length);
        return [point.x, point.y];
    } catch(e) {
        return [0, 0];
    }
}

/**
 * @param {string} d 
 * @returns {number}
 */
function getTotalLength(d) {
    try {
        pathHelper.setAttribute("d", d);
        return pathHelper.getTotalLength();
    } catch(e) {
        return 0;
    }
}


function move(d, dx, dy) {
    let i = 0;
    function alphabeta(ch) {
        return ("A" <= ch && ch <= "Z") ||
               ("a" <= ch && ch <= "z");
    }
    function valid(ch) {
        return alphabeta(ch) ||
               ("0" <= ch && ch <= "9") || 
               (ch === ".") || (ch === "-");
    }
    function read() {
        let ans = "";
        while (i < d.length && !valid(d[i]))
            i++;
        while (i < d.length && valid(d[i]))
            ans = ans + d[i++];
        if (alphabeta(ans[0])) return ans;
        return +ans;
    }
    let ans = "", x1, y1, x2, y2, x, y, rx, ry, D, f0, f1;
    while (i < d.length) {
        let flag = read();
        if (i >= d.length) break;
        switch(flag) {
            case "M":
                x = read();
                y = read();
                ans = ans + "M "
                    + (x + dx) + " "
                    + (y + dy) + " ";
                break;
            case "L":
                x = read();
                y = read();
                ans = ans + "L "
                    + (x + dx) + " "
                    + (y + dy) + " ";
                break;
            case "H":
                x = read();
                ans = ans + "H "
                    + (x + dx) + " ";
                break;
            case "V":
                y = read();
                ans = ans + "V "
                    + (y + dy) + " ";
                break;
            case "Q":
                x1 = read();
                y1 = read();
                x = read();
                y = read();
                ans = ans + "Q "
                    + (x1 + dx) + " "
                    + (y1 + dy) + " "
                    + (x + dx) + " "
                    + (y + dy) + " ";
                break;
            case "T":
                x = read();
                y = read();
                ans = ans + "T "
                    + (x + dx) + " "
                    + (y + dy) + " ";
                break;
            case "C":
                x1 = read();
                y1 = read();
                x2 = read();
                y2 = read();
                x = read();
                y = read();
                ans = ans + "C "
                    + (x1 + dx) + " "
                    + (y1 + dy) + " "
                    + (x2 + dx) + " "
                    + (y2 + dy) + " "
                    + (x + dx) + " "
                    + (y + dy) + " ";
                break;
            case "S":
                x2 = read();
                y2 = read();
                x = read();
                y = read();
                ans = ans + "S "
                    + (x2 + dx) + " "
                    + (y2 + dy) + " "
                    + (x + dx) + " "
                    + (y + dy) + " ";
                break;
            case "A":
                rx = read();
                ry = read();
                D = read();
                f0 = read();
                f1 = read();
                x = read();
                y = read();
                ans = ans + "A " + rx + " " + ry + " " + D + " " + f0 + " " + f1 + " "
                    + (x + dx) + " "
                    + (y + dy) + " ";
                break;
            case "Z":
                ans = ans + "Z ";
                break;
            default:
                throw new Error(flag + " Unknown");
        }
    }
    return ans;
}