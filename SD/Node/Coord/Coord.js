import { Context } from "@/Animate/Context";
import { Vector as V } from "@/Math/Vector";
import { Line } from "@/Node/Nake/Line";
import { Path } from "@/Node/Nake/Path";
import { SDNode } from "@/Node/SDNode";
import { Factory } from "@/Utility/Factory";
import { PathPen } from "@/Utility/PathPen";

function XAxisRule(parent, child) {
    const Y = parent.vars.viewBox.y;
    const H = parent.vars.viewBox.height;
    const currentY = Math.min(Y + H, Math.max(Y, 0));
    child.cy(parent.globalY(currentY));
    child.x(parent.globalX(parent.vars.viewBox.x));
    child.width(parent.width());
}

function YAxisRule(parent, child) {
    const X = parent.vars.viewBox.x;
    const W = parent.vars.viewBox.width;
    const currentX = Math.min(X + W, Math.max(X, 0));
    child.cx(parent.globalX(currentX));
    child.y(parent.globalY(parent.vars.viewBox.y + parent.vars.viewBox.height));
    child.height(parent.height());
}

export function Coord(parent) {
    SDNode.call(this, parent);

    this.vars.merge({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        viewBox: {
            x: 0,
            y: 0,
            width: 5,
            height: 5,
        },
    });

    this.childAs("x-axis", new Line(this).arrow().source(0, 0).target(40, 0), XAxisRule);
    this.childAs("y-axis", new Line(this).arrow().source(0, 40).target(0, 0), YAxisRule);

    this._.BASE_COORD = true;
}

Coord.SAMPLE_COUNT = 50;

function viewBoxHandler(key) {
    return function (value) {
        if (value === undefined) return this.vars.viewBox[key];
        this.vars.viewBox[key] = value;
        return this;
    };
}

Coord.prototype = {
    ...SDNode.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    viewBox: function (x, y, width, height) {
        if (x === undefined) return { x: this.vars.x, y: this.vars.y, width: this.vars.height, height: this.vars.height };
        if (arguments.length === 1) return this.viewBox(x.x, x.y, x.width, x.height);
        this.vars.viewBox = { x, y, width, height };
        return this;
    },
    viewX: viewBoxHandler("x"),
    viewY: viewBoxHandler("y"),
    viewWidth: viewBoxHandler("width"),
    viewHeight: viewBoxHandler("height"),
    coordX: function (x) {
        return ((x - this.x()) / this.width()) * this.viewWidth() + this.viewX();
    },
    coordY: function (y) {
        return ((this.my() - y) / this.height()) * this.viewHeight() + this.viewY();
    },
    coordAt: function (x, y) {
        if (arguments.length === 1) return this.coordAt(x[0], x[1]);
        return [this.coordX(x), this.coordY(y)];
    },
    globalX: function (x) {
        return ((x - this.viewX()) / this.viewWidth()) * this.width() + this.x();
    },
    globalY: function (y) {
        return this.my() - ((y - this.viewY()) / this.viewHeight()) * this.height();
    },
    globalAt: function (x, y) {
        if (arguments.length === 1) return this.globalAt(x[0], x[1]);
        return [this.globalX(x), this.globalY(y)];
    },
    sampleX: function (x, count) {
        return (this.viewWidth() / count) * x + this.viewX();
    },
    sampleY: function (y, count) {
        return (this.viewHeight() / count) * y + this.viewY();
    },
    trim: function (source, target) {
        if (typeof target === "number") return V.intersect(source, target);
        return V.cohenSutherland(source, target, this.x(), this.y(), this.width(), this.height());
    },
    xAxis: function () {
        return this.child("x-axis");
    },
    yAxis: function () {
        return this.child("y-axis");
    },
    draw,
};

function draw(name, func) {
    const path = new Path(this).opacity(0);
    path.vars.merge({
        function: func,
    });

    path.function = Factory.handler("function");
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
    path.startAnimate(this);
    this.childAs(name, path, pathRule);
    return this;
}

Coord.prototype.drawLine = function (name, k, x, y) {
    throw new Error("Not Implemented Yet");
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

function lineRule(parent, child) {
    // if (valueChanged) {
    //     const point = child.member.get("point");
    //     const k = child.member.get("k");
    // }
}

function pathRule(parent, child) {
    const func = child.function();
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
        child.opacity(1).d(pen.toString());
        child.startAnimate(context.tillc(0, 1));
        child.unfreeze();
        child.pointStoT();
        child.freeze();
    } else {
        child.d(pen.toString());
    }
}
