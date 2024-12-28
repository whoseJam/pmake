import { Action } from "@/Animate/Action";
import { Dom } from "@/Dom/Dom";
import { BaseLine } from "@/Node/Nake/BaseLine";
import { Factory } from "@/Utility/Factory";

export function Path(parent) {
    BaseLine.call(this, parent, "path");

    this.type("Path");

    this.vars.merge({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        d: "M0,0L0,0"
    });

    this.vars.associate("d", (newD, oldD) => {
        const duration = this.duration();
        const snap = Snap(this._.nake.nake());
        const t = new Action(
            this.delay(),
            this.delay() + this.duration(),
            oldD, newD,
            function (t) {
                if (t === 0) {
                    if (duration === 0) {
                        snap.attr({ d: this.target });
                    } else {
                        snap.animate({ d: this.target }, duration, mina.easeinout);
                    }
                }
            },
            this, "d"
        );
        const box = Path.pathToBox(newD);
        this.vars.x = box.x;
        this.vars.y = box.y;
        this.vars.width = box.width;
        this.vars.height = box.height;
    })

    this._.nake.setAttribute("d", this.vars.d);
}

Path.prototype = {
    ...BaseLine.prototype
};

Path.prototype.at = function (k) {
    return Path.getPointByRate(this.vars.d, k);
}

Path.prototype.getPointAtLength = function (length) {
    return Path.getPointAtLength(this.vars.d, length);
}

Path.prototype.totalLength = function () {
    return Path.getTotalLength(this.vars.d);
}

Path.prototype.x = function (x) {
    if (x === undefined) return this.vars.x;
    this.d(move(this.vars.d, x - this.vars.x, 0));
    return this;
}

Path.prototype.y = function (y) {
    if (y === undefined) return this.vars.y;
    this.d(move(this.vars.d, 0, y - this.vars.y));
    return this;
}

Path.prototype.d = Factory.handler("d");

Path.prototype.width = function () { return this.vars.width; }
Path.prototype.height = function () { return this.vars.height; }

Path.init = function () {
    Path.helper = Dom.createSVGElement("path");
    Dom.getByID("1").append(Path.helper);
    Path.helper.setAttribute("stroke-opacity", 0);
    Path.helper.setAttribute("fill-opacity", 0);
}

/**
 * @param {string} d 
 * @returns {{x: number, y: number, width: number, height: number}}
 */
Path.pathToBox = function (d) {
    Path.helper.setAttribute("d", d);
    return Path.helper.getBBox();
}

/**
 * @param {string} d 
 * @param {number} length 
 * @returns {[number, number]}
 */
Path.getPointAtLength = function (d, length) {
    try {
        Path.helper.setAttribute("d", d);
        const point = Path.helper.getPointAtLength(length);
        return [point.x, point.y];
    } catch (e) {
        return [0, 0];
    }
}

/**
 * @param {string} d 
 * @param {number} k 
 * @returns {[number, number]}
 */
Path.getPointByRate = function (d, k) {
    try {
        Path.helper.setAttribute("d", d);
        const length = Path.helper.getTotalLength() * k;
        const point = Path.helper.getPointAtLength(length);
        return [point.x, point.y];
    } catch (e) {
        return [0, 0];
    }
}

/**
 * @param {string} d 
 * @returns {number}
 */
Path.getTotalLength = function (d) {
    try {
        Path.helper.setAttribute("d", d);
        return Path.helper.getTotalLength();
    } catch (e) {
        return 0;
    }
}

Path.move = move;

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
        while (i < d.length && valid(d[i])) {
            if (ans.length > 0 && alphabeta(ans[0]) !== alphabeta(d[i])) break;
            if (ans.length > 0 && alphabeta(ans[0])) break;
            ans = ans + d[i++];
        }
        if (alphabeta(ans[0])) return ans;
        return +ans;
    }
    let ans = "", x1, y1, x2, y2, x, y, rx, ry, D, f0, f1;
    while (i < d.length) {
        let flag = read();
        if (i >= d.length) break;
        switch (flag) {
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
