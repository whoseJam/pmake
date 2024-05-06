// @ts-check
import { Action } from "../../Animate/Action";
import { d3ToNake } from "../../Utility/Tool";
import { equal } from "../../Utility/Math";
import { LinkBase } from "./LinkBase";
import { nakeToSnap } from "../../Utility/Tool";
import { SDNode } from "../Node";
import { snapAnimate } from "../../Utility/Tool";

let helper;

export function INIT_PATH(svg) {
    helper = svg.append("path");
    helper.attr("stroke-opacity", 0);
    helper.attr("fill-opacity", 0);
}

export class Path extends LinkBase {
    /**
     * @constructor
     * @param {SDNode|import("../Node").D3Node} node 
     */
    constructor(node) {
        super(node, "path");
        this.g().attr("type", "Path");
        this._.nake = d3ToNake(this._.d3);
        this._.snap = nakeToSnap(this._.nake);
        this._.d = "";
    }

    /**
     * 获取线上的k分位点
     * @param {number} k
     * @returns {import("../../Utility/Math").Vector}
     */
    at(k) {
        try {
            k = Math.min(1, Math.max(0, k));
            helper.attr("d", this._.d);
            /** @type {SVGPathElement} */ // @ts-ignore
            const nake = d3ToNake(helper);
            const length = nake.getTotalLength() * k;
            const point = nake.getPointAtLength(length);
            return [point.x, point.y];
        } catch(e) {
            return [0, 0];
        }
    }

    /**
     * 获取线上距离起点长度length的点
     * @param {number} length 
     * @returns {import("../../Utility/Math").Vector}
     */
    getPointAtLength(length) {
        try {
            helper.attr("d", this._.d);
            /** @type {SVGPathElement} */ // @ts-ignore
            const nake = d3ToNake(helper);
            const point = nake.getPointAtLength(length);
            return [point.x, point.y];
        } catch(e) {
            return [0, 0];
        }
    }

    /**
     * 获取线的总长
     * @returns {number}
     */
    totalLength() {
        try {
            helper.attr("d", this._.d);
            /** @type {SVGPathElement} */ // @ts-ignore
            const nake = d3ToNake(helper);
            return nake.getTotalLength();
        } catch(e) {
            return 0;
        }
    }

    x(x) {
        this.dirtyCheck();
        if (x === undefined) return this._.x;
        if (equal(x, this._.x)) return this;
        this.d(move(this._.d, x - this._.x, 0));
        this._.x = x;
        this.dirty();
        return this;
    }

    y(y) {
        this.dirtyCheck();
        if (y === undefined) return this._.y;
        if (equal(y, this._.y)) return this;
        this.d(move(this._.d, 0, y - this._.y));
        this._.y = y;
        this.dirty();
        return this;
    }

    width(width) {
        this.dirtyCheck();
        if (width === undefined) return this._.width;
        if (equal(width, this._.width)) return this;
        throw new Error("Not Implemented Yet");
    }
    
    height(height) {
        this.dirtyCheck();
        if (height === undefined) return this._.height;
        if (equal(height, this._.height)) return this;
        throw new Error("Not Implemented Yet");
    }

    d(d) {
        this.dirtyCheck();
        if (d === undefined) return this._.d;
        let duration = this.duration();
        let snap = this._.snap;
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this._.d, d,
            function(t, attr = true, firstCall) {
                if (!attr) return this.to;
                if (!firstCall) return this.to;
                snapAnimate(snap, "d", this.to, 0, duration);
                return this.to;
            },
            this, "d"
        );
        this._.d = d;
        let box = pathToBox(d);
        this._.x = box.x;
        this._.y = box.y;
        this._.width = box.width;
        this._.height = box.height;
        this.dirty();
        return this;
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

function pathToBox(d) {
    helper.attr("d", d);
    const box = helper.node().getBBox();
    return box;
}