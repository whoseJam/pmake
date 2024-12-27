import { Action } from "@/Animate/Action";

import { BaseNake } from "@/Node/Nake/BaseNake";
import { Color as C } from "@/Utility/Color";
import { Factory } from "@/Utility/Factory";

export function Polygon(parent, points = []) {
    BaseNake.call(this, parent, "polygon");

    this.type("Polygen");

    this.vars.fill = C.white;
    this.vars.stroke = C.black;
    this.vars.merge({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        points: points
    });

    this.vars.associate("points", (newPoints, oldPoints) => {
        const duration = this.duration();
        const snap = Snap(this._.nake.nake());
        new Action(
            this.delay(),
            this.delay() + this.duration(),
            oldPoints, newPoints,
            function (t) {
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
        UpdateSize.call(this);
    })

    this._.nake.setAttribute("points", this.vars.points);

    UpdateSize.call(this);
}

Polygon.prototype = {
    ...BaseNake.prototype
};

Polygon.prototype.points = Factory.handler("points");

Polygon.prototype.x = function (x) {
    if (x === undefined) return this.vars.x;
    this.points(UpdatePoints(vars, x - vars.x, 0));
    return this;
}

Polygon.prototype.y = function (y) {
    if (y === undefined) return this.vars.y;
    this.points(UpdatePoints(vars, 0, y - vars.y));
    return this;
}

Polygon.prototype.width = function (width) {
    if (width === undefined) return this.vars.width;
    this.points(UpdatePointsWidth(vars, width));
    return this;
}

Polygon.prototype.height = function (height) {
    if (height === undefined) return this.vars.height;
    this.points(UpdatePointsHeight(vars, height));
    return this;
}

function UpdatePoints(vars, dx, dy) {
    const points = vars.points;
    points.forEach(point => {
        point[0] += dx;
        point[1] += dy;
    });
    return points;
}

function UpdatePointsWidth(vars, width) {
    const points = vars.points;
    const x = vars.x;
    const oldWidth = vars.width;
    points.forEach(point => {
        point[0] = (point[0] - x) / oldWidth * width + x;
    });
    return points;
}

function UpdatePointsHeight(vars, height) {
    const points = vars.points;
    const y = vars.y;
    const oldHeight = vars.height;
    points.forEach(point => {
        point[1] = (point[1] - y) / oldHeight * height + y;
    });
    return points;
}

function UpdateSize() {
    const box = GetBox(this.vars.points);
    this.vars.x = box.x;
    this.vars.y = box.y;
    this.vars.width = box.width;
    this.vars.height = box.height;
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