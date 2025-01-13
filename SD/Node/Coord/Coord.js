import { Line } from "@/Node/Nake/Line";
import { Path } from "@/Node/Nake/Path";
import { SDNode } from "@/Node/SDNode";

import { Context } from "@/Animate/Context";
import { PathPen } from "@/Utility/PathPen";

import { Vector as V } from "@/Math/Vector";

function XAxisRule(parent, child) {
    const Y = parent.member.get("view-y");
    const H = parent.member.get("view-height");
    const currentY = Math.min(Y + H, Math.max(Y, 0));
    child.cy(parent.globalY(currentY));
    child.x(parent.globalX(parent.viewX()));
    child.width(parent.width());
}

function YAxisRule(parent, child) {
    const X = parent.member.get("view-x");
    const W = parent.member.get("view-width");
    const currentX = Math.min(X + W, Math.max(X, 0));
    child.cx(parent.globalX(currentX));
    child.y(parent.globalY(parent.viewY() + parent.viewHeight()));
    child.height(parent.height());
}

export function Coord(parent) {
    SDNode.call(this, parent);

    this.member.new("x", 0);
    this.member.new("y", 0);
    this.member.new("width", 100);
    this.member.new("height", 100);
    this.member.new("view-x", 0);
    this.member.new("view-y", 0);
    this.member.new("view-width", 5);
    this.member.new("view-height", 5);

    this.childAs("x-axis", new Line(this).arrow().source(0, 0).target(40, 0), XAxisRule);
    this.childAs("y-axis", new Line(this).arrow().source(0, 40).target(0, 0), YAxisRule);

    this._.BASE_COORD = true;
}

Coord.SAMPLE_COUNT = 50;

Coord.prototype = {
    ...SDNode.prototype,
};

// Coord.prototype.x          = SDNode.OrdinaryGSet("x", "setByEqual");
// Coord.prototype.y          = SDNode.OrdinaryGSet("y", "setByEqual");
// Coord.prototype.width      = SDNode.OrdinaryGSet("width", "setByEqual");
// Coord.prototype.height     = SDNode.OrdinaryGSet("height", "setByEqual");
// Coord.prototype.viewX      = SDNode.OrdinaryGSet("view-x", "setByEqual");
// Coord.prototype.viewY      = SDNode.OrdinaryGSet("view-y", "setByEqual");
// Coord.prototype.viewWidth  = SDNode.OrdinaryGSet("view-width", "setByEqual");
// Coord.prototype.viewHeight = SDNode.OrdinaryGSet("view-height", "setByEqual");

Coord.prototype.coordX = function (x) {
    return ((x - this.x()) / this.width()) * this.viewWidth() + this.viewX();
};

Coord.prototype.coordY = function (y) {
    return ((this.my() - y) / this.height()) * this.viewHeight() + this.viewY();
};

Coord.prototype.coordAt = function (x, y) {
    if (arguments.length === 1) return this.coordAt(x[0], x[1]);
    return [this.coordX(x), this.coordY(y)];
};

Coord.prototype.globalX = function (x) {
    return ((x - this.viewX()) / this.viewWidth()) * this.width() + this.x();
};

Coord.prototype.globalY = function (y) {
    return this.my() - ((y - this.viewY()) / this.viewHeight()) * this.height();
};

Coord.prototype.globalAt = function (x, y) {
    if (arguments.length === 1) return this.globalAt(x[0], x[1]);
    return [this.globalX(x), this.globalY(y)];
};

Coord.prototype.sampleX = function (x, count) {
    return (this.viewWidth() / count) * x + this.viewX();
};

Coord.prototype.sampleY = function (y, count) {
    return (this.viewHeight() / count) * y + this.viewY();
};

Coord.prototype.trim = function (source, target) {
    if (typeof target === "number") return V.intersect(source, target);
    return V.cohenSutherland(source, target, this.x(), this.y(), this.width(), this.height());
};

Coord.prototype.xAxis = function () {
    return this.child("x-axis");
};

Coord.prototype.yAxis = function () {
    return this.child("y-axis");
};

const COORD_LOCATION_KEYS = {
    "view-x": "parent-view-x",
    "view-y": "parent-view-y",
    "view-width": "parent-view-width",
    "view-height": "parent-view-height",
    "x": "parent-x",
    "y": "parent-y",
    "width": "parent-width",
    "height": "parent-height",
};

Coord.prototype.draw = function (name, func) {
    const parent = this;
    const path = new Path(this).opacity(0);
    for (let key in COORD_LOCATION_KEYS) path.member.new(COORD_LOCATION_KEYS[key]);

    path.startAnimate(this);

    path.member.new("function", func);

    path.function = SDNode.ordinaryGetterAndSetter("function", "set");

    path.coordX = function (y) {
        return this.function()(y);
    };
    path.coordY = function (x) {
        return this.function()(x);
    };
    path.trimCoordX = function (y) {
        return Math.min(Math.max(this.coordX(y), parent.viewX(), parent.viewX() + parent.viewWidth()));
    };
    path.trimCoordY = function (x) {
        return Math.min(Math.max(this.coordY(x), parent.viewY(), parent.viewY() + parent.viewHeight()));
    };
    path.globalY = function (x) {
        return parent.globalY(this.coordY(x));
    };
    path.globalX = function (y) {
        return parent.globalX(this.coordX(y));
    };
    path.trimGlobalY = function (x) {
        return Math.min(Math.max(this.globalY(x), parent.y()), parent.my());
    };
    path.trimGlobalX = function (y) {
        return Math.min(Math.max(this.globalX(y), parent.x()), parent.mx());
    };

    this.childAs(name, path, PathRule);

    return path;
};

Coord.prototype.drawLine = function (name, k, x, y) {
    if (arguments.length === 3) return this.drawLine(name, k, x[0], x[1]);
    const line = new Line(this).opacity(0);
    for (let key in COORD_LOCATION_KEYS) line.member.new(COORD_LOCATION_KEYS[key]);

    line.startAnimate(this);
    line.member.new("k", k);
    line.member.new("point", [x, y]);

    line.k = SDNode.ordinaryGetterAndSetter("k", "setByDqual");
    line.point = SDNode.ordinaryGetterAndSetter("point", "set");

    this.childAs(name, line, LineRule);

    return line;
};

function LineRule(parent, child) {
    let valueChanged = false;
    for (let key in COORD_LOCATION_KEYS) {
        child.member.setByEqual(COORD_LOCATION_KEYS[key], parent.member.get(key));
        valueChanged |= child.member.hasChanged(COORD_LOCATION_KEYS[key]);
    }
    if (valueChanged) {
        const point = child.member.get("point");
        const k = child.member.get("k");
    }
}

function PathRule(parent, child) {
    let valueChanged = false;
    for (let key in COORD_LOCATION_KEYS) {
        child.member.setByEqual(COORD_LOCATION_KEYS[key], parent.member.get(key));
        valueChanged |= child.member.hasChanged(COORD_LOCATION_KEYS[key]);
    }
    if (valueChanged || child.member.hasChanged("function")) {
        const func = child.member.get("function");
        const pen = new PathPen();
        let firstMoveTo = false;
        for (let i = 0; i <= Coord.SAMPLE_COUNT; i++) {
            const x = parent.sampleX(i, Coord.SAMPLE_COUNT);
            const y = func(x);
            const lastX = parent.sampleX(i - 1, Coord.SAMPLE_COUNT);
            const lastY = func(lastX);
            const point = parent.globalAt(x, y);
            const lastPoint = parent.globalAt(lastX, lastY);
            const [source, target, accpeted] = parent.trim(lastPoint, point);
            if (!accpeted) {
                firstMoveTo = false;
                continue;
            }
            if (!firstMoveTo) {
                pen.MoveTo(source);
                firstMoveTo = true;
            }
            pen.LinkTo(target);
        }
        if (!child.opacity()) {
            const context = new Context(child);
            child.startAnimate(context.tillc(0, 0));
            child.opacity(1).d(pen.toString()).update();
            child.startAnimate(context.tillc(0, 1));
            child.unfreeze();
            child.pointStoT();
            child.freeze();
        } else {
            child.d(pen.toString());
        }
    }
}
