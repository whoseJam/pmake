import { Action } from "@/Animate/Action";

import { SDNode }   from "@/Node/SDNode";
import { BaseNake } from "@/Node/Nake/BaseNake";

export function Polygon(parent, points = []) {
    BaseNake.call(this, parent, "polygon");

    this.type("Polygen");

    this.member.setAndFlush("fill", "#ffffff");
    this.member.setAndFlush("stroke", "#000000");
    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 0);
    this.member.new("height", 0);
    this.member.new("points", points);

    const nake = this._.nake;
    nake.setAttribute("points", this.member.get("points"));
    nake.setAttribute("fill", this.member.get("fill"));
    nake.setAttribute("stroke", this.member.get("stroke"));

    UpdateSize.call(this);
}

Polygon.prototype = {
    ...BaseNake.prototype
};

Polygon.prototype.points = SDNode.OrdinaryGSet("points", "set");

Polygon.prototype.x = function(x) {
    if (x === undefined) return this.member.get("x");
    UpdatePoints.call(this, x - this.member.get("x"), 0);
    this.member.dirty("points");
    this.member.setByEqual("x", x);
    this.tryUpdate();
    return this;
}

Polygon.prototype.y = function(y) {
    if (y === undefined) return this.member.get("y");
    UpdatePoints.call(this, 0, y - this.member.get("y"));
    this.member.dirty("points");
    this.member.setByEqual("y", y);
    this.tryUpdate();
    return this;
}

Polygon.prototype.width = function(width) {
    if (width === undefined) return this.member.get("width");
    UpdatePointsWidth.call(this, width);
    this.member.dirty("points");
    this.member.setByEqual("width", width);
    this.tryUpdate();
    return this;
}

Polygon.prototype.height = function(height) {
    if (height === undefined) return this.member.get("height");
    UpdatePointsHeight.call(this, height);
    this.member.dirty("points");
    this.member.setByEqual("height", height);
    this.tryUpdate();
    return this;
}

Polygon.prototype.updateList = [
    ...Polygon.prototype.updateList,
    update
];

function update() {
    if (this.member.hasChanged("points")) {
        const duration = this.duration();
        const snap = Snap(this._.nake.nake());
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            this.member.oldValue("points"),
            this.member.get("points"),
            function(t) {
                if (t === 0) {
                    if (duration === 0) {
                        snap.attr({ points: this.target });
                    } else {
                        snap.animate({ points: this.target }, duration, mina.easeinout);
                    }
                }
            },
            this, "points"
        );
        this.member.flush("points");
        UpdateSize.call(this);
    }
}

function UpdatePoints(dx, dy) {
    const points = this.member.get("points");
    points.forEach(point => {
        point[0] += dx;
        point[1] += dy;
    });
}

function UpdatePointsWidth(width) {
    const points = this.member.get("points");
    const x = this.member.get("x");
    const oldWidth = this.member.get("width");
    points.forEach(point => {
        point[0] = (point[0] - x) / oldWidth * width + x;
    });
}

function UpdatePointsHeight(height) {
    const points = this.member.get("points");
    const y = this.member.get("y");
    const oldHeight = this.member.get("height");
    points.forEach(point => {
        point[1] = (point[1] - y) / oldHeight * height + y;
    })
}

function UpdateSize() {
    const box = GetBox(this.member.get("points"));
    this.member.setAndFlush("x", box.x);
    this.member.setAndFlush("y", box.y);
    this.member.setAndFlush("width", box.width);
    this.member.setAndFlush("height", box.height);
}

function GetBox(points) {
    let x = Infinity, mx = -Infinity;
    let y = Infinity, my = -Infinity;
    points.forEach((point) => {
        x = Math.min(x, point[0]); mx = Math.max(mx, point[0]);
        y = Math.min(y, point[1]); my = Math.max(my, point[1]);
    });
    if (x === Infinity || y === Infinity) return { x: 0, y: 0, width: 0, height: 0 };
    return { x: x, y: y, width: mx - x, height: my - y };
}