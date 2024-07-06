import { Action } from "@/Animate/Action";
import { d3ToNake } from "@/Utility/Tool";
import { snapAction } from "@/Utility/Tool";
import { BaseLine } from "./BaseLine";

export function Path(parent) {
    BaseLine.call(this, parent, "path");

    this.g().type("Path");

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 0);
    this.member.new("height", 0);
    this.member.new("d", "M 0, 0 L 0, 0");

    const nake = this._.nake;
    nake.setAttribute("d", this.member.get("d"));
}

Path.prototype = {
    ...BaseLine.prototype
};

Path.prototype.updateList = [
    ...Path.prototype.updateList,
    update
];

Path.prototype.at = function(k) {
    return getPointByRate(this.member.get("d"), k);
}

Path.prototype.getPointAtLength = function(length) {
    return getPointAtLength(this.member.get("d"), length);
}

Path.prototype.totalLength = function() {
    return getTotalLength(this.member.get("d"));
}

Path.prototype.x = function(x) {
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

Path.prototype.y = function(y) {
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

Path.prototype.d = function(d) {
    if (d === undefined) {
        return this.member.get("d");
    }
    this.member.set("d", d);
    this.tryUpdate();
    return this;
}

function update() {
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
        const box = pathToBox(this.member.get("d"));
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