import { Action } from "@/Animate/Action";

import { BaseLine } from "@/Node/Nake/BaseLine";

import { Dom } from "@/Dom/Dom";

export function Path(parent) {
    BaseLine.call(this, parent, "path");

    this.type("Path");

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
    return Path.getPointByRate(this.member.get("d"), k);
}

Path.prototype.getPointAtLength = function(length) {
    return Path.getPointAtLength(this.member.get("d"), length);
}

Path.prototype.totalLength = function() {
    return Path.getTotalLength(this.member.get("d"));
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

Path.prototype.width = function(width) {
    return this.member.get("width");
}

Path.prototype.height = function(height) {
    return this.member.get("height");
}

function update() {
    if (this.member.hasChanged("d")) {
        const duration = this.duration();
        const snap = Snap(this._.nake.element);
        const t = new Action(
            this.delay(),
            this.delay() + this.duration(),
            this.member.oldValue("d"),
            this.member.get("d"),
            function(t) {
                if (t === 0) {
                    if (duration === 0) {
                        snap.attr({ d: this.to });
                    } else {
                        snap.animate({ d: this.to }, duration, mina.easeinout);
                    }
                }
            },
            this, "d"
        );
        console.log(t.log());
        const box = Path.pathToBox(this.member.get("d"));
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

Path.init = function() {
    Path.helper = Dom.createSVGElement("path");
    Dom.getByID("1").append(Path.helper);
    Path.helper.setAttribute("stroke-opacity", 0);
    Path.helper.setAttribute("fill-opacity", 0);
}

/**
 * @param {string} d 
 * @returns {{x: number, y: number, width: number, height: number}}
 */
Path.pathToBox = function(d) {
    Path.helper.setAttribute("d", d);
    return Path.helper.getBBox();
}

/**
 * @param {string} d 
 * @param {number} length 
 * @returns {[number, number]}
 */
Path.getPointAtLength = function(d, length) {
    try {
        Path.helper.setAttribute("d", d);
        const point = Path.helper.getPointAtLength(length);
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
Path.getPointByRate = function(d, k) {
    try {
        Path.helper.setAttribute("d", d);
        const length = Path.helper.getTotalLength() * k;
        const point = Path.helper.getPointAtLength(length);
        return [point.x, point.y];
    } catch(e) {
        return [0, 0];
    }
}

/**
 * @param {string} d 
 * @returns {number}
 */
Path.getTotalLength = function(d) {
    try {
        Path.helper.setAttribute("d", d);
        return Path.helper.getTotalLength();
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