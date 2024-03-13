import { SnapHelper } from "../../Utility/SnapHelper";
import { D3Helper } from "../../Utility/D3Helper";
import { equal } from "../../Utility/Math";
import { LinkBase } from "./LinkBase";
import { Action } from "../../slide";

let helper;
export function INIT_PATH(svg) {
    helper = svg.append("path");
    helper.attr("stroke-opacity", 0);
    helper.attr("fill-opacity", 0);
}

export class Path extends LinkBase {
    constructor(node) {
        super(node, "path");
        this.g().attr("Path", "");
        this._.snap = Snap(D3Helper.element(this._.d3));
        this._.d = "";
    }

    at(k) {
        k = Math.min(1, Math.max(0, k));
        helper.attr("d", this._.d);
        let elem = D3Helper.element(helper)
        let length = elem.getTotalLength() * k;
        let point = elem.getPointAtLength(length);
        return [point.x, point.y];
    }
    
    getPointAtLength(length) {
        helper.attr("d", this._.d);
        let elem = D3Helper.element(helper)
        let point = elem.getPointAtLength(length);
        return [point.x, point.y];
    }

    totalLength() {
        helper.attr("d", this._.d);
        let elem = D3Helper.element(helper);
        return elem.getTotalLength();
    }

    x(x) {
        let ox = this._.x;
        if (x === undefined)
            return ox;
        if (equal(x, ox)) return this;
        this._.x = x;
        this.d(move(this._.d, x - ox, 0));
        return this;
    }

    y(y) {
        let oy = this._.y;
        if (y === undefined)
            return oy;
        if (equal(y, oy)) return this;
        this._.y = y;
        this.d(move(this._.d, 0, y - oy));
        return this;
    }

    width(width) {
        let owidth = this._.width;
        if (width === undefined)
            return owidth;
        if (equal(width, owidth)) return this;
        throw new Error;
        return this;
    }
    
    height(height) {
        let oheight = this._.height;
        if (height === undefined)
            return oheight;
        if (equal(height, oheight)) return this;
        throw new Error;
        return this;
    }

    d(pathStr) {
        if (pathStr === undefined)
            return this._.d;
        let duration = this.duration(), snap = this._.snap;
        new Action(
            this.delay(),
            this.delay(),
            this._.d, pathStr,
            function(t, attr=true) {
                if (attr) {
                    SnapHelper.action({
                        elem: snap,
                        start: 0,
                        end: duration,
                        key: "d",
                        value: this.to
                    })
                }
                return this.to;
            },
            this, "d"
        );
        this._.d = pathStr;
        let box = path2box(pathStr);
        this._.x = box.x;
        this._.y = box.y;
        this._.width = box.width;
        this._.height = box.height;
        return this;
    }
}

function move(pathStr, dx, dy) {
    let i = 0;
    function alphabeta(ch) {
        return ("A" <= ch && ch <= "Z") ||
               ("a" <= ch && ch <= "z");
    }
    function valid(ch) {
        return alphabeta(ch) ||
               ("0" <= ch && ch <= "9") || 
               (ch === ".");
    }
    function read() {
        let ans = "";
        while (i < pathStr.length && !valid(pathStr[i]))
            i++;
        while (i < pathStr.length && valid(pathStr[i]))
            ans = ans + pathStr[i++];
        if (alphabeta(ans[0])) return ans;
        return +ans;
    }
    let ans = "", x1, y1, x2, y2, x, y, rx, ry, d, f0, f1;
    while (i < pathStr.length) {
        let flag = read();
        if (i >= pathStr.length) break;
        switch(flag) {
            case "M":
                x = read();
                y = read();
                ans = ans + "M "
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
                d = read();
                f0 = read();
                f1 = read();
                x = read();
                y = read();
                ans = ans + "A " + rx + " " + ry + " " + d + " " + f0 + " " + f1 + " "
                    + (x + dx) + " "
                    + (y + dy) + " ";
                break;
            case "Z":
                ans = ans + "Z ";
                break;
            default:
                throw new Error(flag + " unknown");
        }
    }
    return ans;
}

function path2box(pathStr) {
    helper.attr("d", pathStr);
    let box = helper.node().getBBox();
    return {
        x: box.x, y: box.y,
        width: box.width,
        height: box.height,
    };
}