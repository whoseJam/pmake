import { Action } from "@/Animate/Action";
import { D3Layer } from "@/Node/D3Layer";
import { d3ToNake } from "@/Utility/Tool";
import { equal } from "@/Utility/Math";
import { SDNode } from "@/Node/Node";
import { snapAction } from "@/Utility/Tool";
import { BaseLink } from "./BaseLink";

/**
 * @class Path
 */
export class Path extends BaseLink {
    /**
     * @constructor
     * @param {SDNode|D3Layer} parent
     */
    constructor(parent) {
        super(parent, "path");

        this.g().type("Path");
        
        this.member.new("d", "M 0, 0 L 0, 0");

        const nake = this._.nake;
        nake.setAttribute("d", this.member.get("d"));
    }

    /**
     * 获取线上的k分位点
     * @param {number} k
     * @returns {[number, number]}
     */
    at(k) {
        return getPointByRate(this.member.get("d"), k);
    }

    /**
     * 获取线上距离起点长度length的点
     * @param {number} length 
     * @returns {[number, number]}
     */
    getPointAtLength(length) {
        return getPointAtLength(this.member.get("d"), length);
    }

    /**
     * 获取线的总长
     * @returns {number}
     */
    totalLength() {
        return getTotalLength(this.member.get("d"));
    }

    /**
     * @overload
     * @param {number} x 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    x(x) {
        if (x === undefined) {
            return this.member.get("x");
        }
        this.member.setByEqual("x", x);
        this.d(move(
            this.member.get("d"),
            x - this.member.get("x"),
            0));
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
        if (y === undefined) {
            return this.member.get("y");
        }
        this.member.setByEqual("y", y);
        this.d(move(
            this.member.get("d"),
            0,
            y - this.member.get("y")));
        return this;
    }

    /**
     * @overload
     * @param {number} width 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    width() {
        return this.member.get("width");
    }
    
    /**
     * @overload
     * @param {number} height 
     * @returns {this}
     * @overload
     * @returns {number}
     */
    height() {
        return this.member.get("height");
    }

    /**
     * @overload
     * @param {string} d 
     * @returns {this}
     * @overload
     * @returns {string}
     */
    d(d) {
        if (d === undefined) {
            return this.member.get("d");
        }
        this.member.set("d", d);
        this.tryUpdate();
        return this;
    }

    update() {
        this.preUpdate();
        
        if (this.member.hasChanged("d")) {
            const duration = this.duration();
            const snap = this._.snap;
            new Action(
                this.delay(),
                this.delay() + this.duration(),
                this.member.oldValue("d"),
                this.member.get("d"),
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
            this.member.set("x", box.x);
            this.member.set("y", box.y);
            this.member.set("width", box.width);
            this.member.set("height", box.height);
            this.member.flush("x");
            this.member.flush("y");
            this.member.flush("width");
            this.member.flush("height");
            this.member.flush("d");
        }
        
        this.postUpdate();
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