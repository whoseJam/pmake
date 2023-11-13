import { Node } from "../../Node/Node";
import { Interact } from "../../Interact/Interact";
import { SnapHelper } from "../../Utility/SnapHelper";
import { D3Helper } from "../../Utility/D3Helper";
import { equal } from "../../Utility/Math";
import { AbsBasic } from "./Basic";
import { Color } from "../../Utility/Color";

let helper;
export function INIT_PATH(svg) {
    helper = svg.append("path");
    helper.attr("stroke-opacity", 0);
    helper.attr("fill-opacity", 0);
}

export function Path(node) {
    let self = {};
    
    self = Node(self, node, "Path");
    self = AbsBasic(self);
    self = Interact(self);

    self._.d3 = self._.group.append("path");
    self._.snap = Snap(D3Helper.element(self._.d3));
    self._.pathStr = "";
    
    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;
    self.d = d;
    self.totalLength = totalLength;
    self.getPointAtLength = getPointAtLength;
    self.at = at;
    self.markerStart = markerStart;
    self.markerMid = markerMid;
    self.markerEnd = markerEnd;

    self.fill(Color.white);
    self.fillOpacity(0);
    self.stroke(Color.black);
    self.strokeOpacity(1);
    self.opacity(1);
    
    return self;
}

function x(x) {
    let ox = this._.x;
    if (x === undefined)
        return ox;
    if (equal(x, ox)) return this;
    this.dirty();
    this._.x = x;
    this._.d = move(this._.d, x - ox, 0);
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "d",
            value: this._.d
        })
    );
    this.call("onX");
    return this;
}

function y(y) {
    let oy = this._.y;
    if (y === undefined)
        return oy;
    if (equal(y, oy)) return this;
    this.dirty();
    this._.y = y;
    this._.d = move(this._.d, 0, y - oy);
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "d",
            value: this._.d
        })
    );
    this.call("onY");
    return this;
}

function width(width) {
    let owidth = this._.width;
    if (width === undefined)
        return owidth;
    if (equal(width, owidth)) return this;
    throw new Error;
    return this;
}

function height(height) {
    let oheight = this._.height;
    if (height === undefined)
        return oheight;
    if (equal(height, oheight)) return this;
    throw new Error;
    return this;
}

function markerStart(mark) {
    if (mark === undefined)
        return this.get("markerStart");
    this.set("markerStart", mark, true);
    mark = (typeof(mark) === "string" ? "url(#" + mark + ")" : "");
    this.animate.launch(
        D3Helper.action({
            elem: this._.d3,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "marker-start",
            value: mark
        })
    );
    return this;
}

function markerMid(mark) {
    if (mark === undefined)
        return this.get("marker_mid");
    this.set("marker_mid", mark, true);
    mark = (typeof(mark) === "string" ? "url(#" + mark + ")" : "");
    this.animate.launch(
        D3Helper.action({
            elem: this._.d3,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "marker-mid",
            value: mark
        })
    );
    return this;
}

function markerEnd(mark) {
    if (mark === undefined)
        return this.get("marker_end");
    this.set("markerEnd", mark, true);
    mark = (typeof(mark) === "string" ? "url(#" + mark + ")" : "");
    this.animate.launch(
        D3Helper.action({
            elem: this._.d3,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "marker-end",
            value: mark
        })
    );
    return this;
}

function d(pathStr) {
    if (pathStr === undefined)
        return this._.d;
    this._.d = pathStr;
    this.animate.launch(
        SnapHelper.action({
            elem: this._.snap,
            start: this.delay(),
            end: this.delay() + this.duration(),
            key: "d",
            value: this._.d
        })
    );
    let box = path2box(pathStr);
    this._.x = box.x; this.call("onX");
    this._.y = box.y; this.call("onY");
    this._.width = box.width; this.call("onWidth");
    this._.height = box.height; this.call("onHeight");
    return this;
}

function totalLength() {
    helper.attr("d", this._.d);
    let elem = D3Helper.element(helper);
    return elem.getTotalLength();
}

function at(k) {
    k = Math.min(1, Math.max(0, k));
    helper.attr("d", this._.d);
    let elem = D3Helper.element(helper)
    let length = elem.getTotalLength() * k;
    let point = elem.getPointAtLength(length);
    return [point.x, point.y];
}

function getPointAtLength(length) {
    helper.attr("d", this._.d);
    let elem = D3Helper.element(helper)
    let point = elem.getPointAtLength(length);
    return [point.x, point.y];
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
        console.log("flag=", flag, "i=", i, "length=", pathStr.length);
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